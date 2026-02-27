/**
 * Generic HTML menu extractor.
 * Uses pattern-based extraction for dispensary websites with custom-built menus.
 * Looks for price patterns, weight patterns, THC%, and category headings
 * to identify and group products.
 */

import * as cheerio from 'cheerio'
import type { ExtractedProduct } from './iframe-embed'

// Regex patterns for product data extraction
const PRICE_PATTERN = /\$(\d{1,4}(?:\.\d{2})?)/g
const WEIGHT_PATTERN = /\b((?:\d+(?:\.\d+)?)\s*(?:g|oz|mg|ml|pk|pack|count|ct|unit|piece)s?|(?:1\/[248]|3\.5g?|7g?|14g?|28g?|eighth|quarter|half|ounce|gram))\b/gi
const THC_PATTERN = /(?:THC|thc)[:\s]*(\d{1,2}(?:\.\d{1,2})?)\s*%?/i
const CBD_PATTERN = /(?:CBD|cbd)[:\s]*(\d{1,2}(?:\.\d{1,2})?)\s*%?/i

// Category detection keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  flower: ['flower', 'bud', 'nug', 'loose flower', 'premium flower'],
  edibles: ['edible', 'gummy', 'gummies', 'chocolate', 'candy', 'beverage', 'drink', 'cookie', 'brownie'],
  vapes: ['vape', 'cartridge', 'cart', 'pen', 'pod', 'disposable'],
  'pre-rolls': ['pre-roll', 'preroll', 'pre roll', 'joint', 'blunt', 'infused roll'],
  concentrates: ['concentrate', 'dab', 'wax', 'shatter', 'rosin', 'resin', 'budder', 'badder', 'sauce', 'diamond'],
  tinctures: ['tincture', 'oil', 'capsule', 'tablet', 'pill', 'sublingual', 'rso'],
  topicals: ['topical', 'cream', 'balm', 'lotion', 'salve', 'patch', 'transdermal'],
}

/**
 * Extract products from arbitrary HTML content using pattern matching.
 */
export function extractHtmlProducts(html: string): ExtractedProduct[] {
  const $ = cheerio.load(html)
  const products: ExtractedProduct[] = []

  // Strategy 1: Look for structured product cards/items
  const productCards = findProductCards($)
  if (productCards.length >= 3) {
    return productCards
  }

  // Strategy 2: Look for product tables
  const tableProducts = findProductTables($)
  if (tableProducts.length >= 3) {
    return tableProducts
  }

  // Strategy 3: Section-based extraction (headings + items below)
  const sectionProducts = findSectionProducts($)
  if (sectionProducts.length >= 3) {
    return sectionProducts
  }

  return products
}

/**
 * Strategy 1: Find product cards (divs/articles with price + name).
 */
function findProductCards($: cheerio.CheerioAPI): ExtractedProduct[] {
  const products: ExtractedProduct[] = []

  // Common product card selectors
  const cardSelectors = [
    '[class*="product"]',
    '[class*="menu-item"]',
    '[class*="menuItem"]',
    '[class*="item-card"]',
    '[class*="product-card"]',
    '[data-product]',
    '[data-item]',
    'article',
    '.card',
  ]

  let currentCategory = 'other'

  for (const selector of cardSelectors) {
    const cards = $(selector)
    if (cards.length < 3) continue

    cards.each((_, card) => {
      const cardEl = $(card)
      const text = cardEl.text()

      // Must have at least one price
      const priceMatch = text.match(PRICE_PATTERN)
      if (!priceMatch || priceMatch.length === 0) return

      const price = parseFloat(priceMatch[0].replace('$', ''))
      if (price <= 0 || price > 2000) return

      // Extract name (prefer headings, then strong/b, then first text node)
      let name = ''
      const heading = cardEl.find('h2, h3, h4, h5, .name, .title, [class*="name"], [class*="title"]').first()
      if (heading.length) {
        name = heading.text().trim()
      } else {
        const strong = cardEl.find('strong, b').first()
        if (strong.length) {
          name = strong.text().trim()
        }
      }

      if (!name || name.length < 2 || name.length > 200) return
      // Skip if name looks like a heading/category rather than product
      if (name.toLowerCase().includes('category') || name.toLowerCase().includes('all products')) return

      // Detect category from nearby headings or card classes
      const nearbyHeading = cardEl.prevAll('h1, h2, h3, h4').first().text().toLowerCase()
      const cardClass = (cardEl.attr('class') || '').toLowerCase()
      const detectedCategory = detectCategory(nearbyHeading + ' ' + cardClass + ' ' + text)
      if (detectedCategory) currentCategory = detectedCategory

      // Extract optional fields
      const originalPrice = priceMatch.length > 1
        ? parseFloat(priceMatch[1].replace('$', ''))
        : undefined

      const weightMatch = text.match(WEIGHT_PATTERN)
      const thcMatch = text.match(THC_PATTERN)
      const cbdMatch = text.match(CBD_PATTERN)

      // Brand detection
      const brandEl = cardEl.find('[class*="brand"], .brand, .manufacturer')
      const brand = brandEl.length ? brandEl.first().text().trim() : undefined

      // Image
      const img = cardEl.find('img').first()
      const imageUrl = img.attr('src') || img.attr('data-src') || undefined

      // Strain type from text or badges
      let strainType: string | undefined
      const textLower = text.toLowerCase()
      if (textLower.includes('indica')) strainType = 'indica'
      else if (textLower.includes('sativa')) strainType = 'sativa'
      else if (textLower.includes('hybrid')) strainType = 'hybrid'

      products.push({
        name,
        category: currentCategory,
        brand: brand && brand.length > 1 ? brand : undefined,
        strainType,
        price,
        originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
        weight: weightMatch?.[0],
        thcContent: thcMatch ? thcMatch[1] + '%' : undefined,
        cbdContent: cbdMatch ? cbdMatch[1] + '%' : undefined,
        imageUrl: imageUrl && imageUrl.startsWith('http') ? imageUrl : undefined,
        isOnSale: originalPrice !== undefined && originalPrice > price,
      })
    })

    if (products.length >= 3) break
  }

  return deduplicateProducts(products)
}

/**
 * Strategy 2: Extract products from HTML tables.
 */
function findProductTables($: cheerio.CheerioAPI): ExtractedProduct[] {
  const products: ExtractedProduct[] = []

  $('table').each((_, table) => {
    const rows = $(table).find('tr')
    if (rows.length < 3) return

    let currentCategory = 'other'

    rows.each((_, row) => {
      const cells = $(row).find('td, th')
      if (cells.length < 2) return

      const rowText = $(row).text()
      const priceMatch = rowText.match(PRICE_PATTERN)
      if (!priceMatch) {
        // Might be a category header row
        const cat = detectCategory(rowText)
        if (cat) currentCategory = cat
        return
      }

      const name = $(cells[0]).text().trim()
      if (!name || name.length < 2) return

      const price = parseFloat(priceMatch[0].replace('$', ''))
      if (price <= 0 || price > 2000) return

      const thcMatch = rowText.match(THC_PATTERN)
      const weightMatch = rowText.match(WEIGHT_PATTERN)

      products.push({
        name,
        category: currentCategory,
        price,
        weight: weightMatch?.[0],
        thcContent: thcMatch ? thcMatch[1] + '%' : undefined,
        isOnSale: false,
      })
    })
  })

  return deduplicateProducts(products)
}

/**
 * Strategy 3: Section-based extraction using headings as category markers.
 */
function findSectionProducts($: cheerio.CheerioAPI): ExtractedProduct[] {
  const products: ExtractedProduct[] = []
  let currentCategory = 'other'

  // Walk through headings and their following content
  $('h1, h2, h3, h4').each((_, heading) => {
    const headingText = $(heading).text().toLowerCase()
    const cat = detectCategory(headingText)
    if (cat) currentCategory = cat

    // Get sibling elements until next heading
    let el = $(heading).next()
    let count = 0
    while (el.length && count < 100) {
      if (el.is('h1, h2, h3, h4')) break

      const text = el.text()
      const priceMatch = text.match(PRICE_PATTERN)

      if (priceMatch) {
        const price = parseFloat(priceMatch[0].replace('$', ''))
        if (price > 0 && price < 2000) {
          // Try to extract a name
          const nameEl = el.find('strong, b, .name, .title, h5, h6').first()
          const name = nameEl.length ? nameEl.text().trim() : text.split('$')[0].trim().slice(0, 100)

          if (name && name.length >= 2) {
            const thcMatch = text.match(THC_PATTERN)
            const weightMatch = text.match(WEIGHT_PATTERN)

            products.push({
              name,
              category: currentCategory,
              price,
              weight: weightMatch?.[0],
              thcContent: thcMatch ? thcMatch[1] + '%' : undefined,
              isOnSale: false,
            })
          }
        }
      }

      el = el.next()
      count++
    }
  })

  return deduplicateProducts(products)
}

/**
 * Detect product category from text.
 */
function detectCategory(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return category
    }
  }
  return null
}

/**
 * Remove duplicate products (same name + weight).
 */
function deduplicateProducts(products: ExtractedProduct[]): ExtractedProduct[] {
  const seen = new Set<string>()
  return products.filter((p) => {
    const key = `${p.name.toLowerCase()}-${p.weight || ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
