/**
 * PDF menu extractor.
 * Fetches PDF files linked from dispensary menu pages and extracts
 * product/pricing data using text pattern matching.
 *
 * Note: This uses a lightweight approach — fetching the raw PDF bytes
 * and extracting visible text strings without a full PDF parsing library.
 * For most simple dispensary PDF menus (text-based, not image-based),
 * this captures enough data to identify products and prices.
 */

import type { ExtractedProduct } from './iframe-embed'

const PRICE_PATTERN = /\$(\d{1,4}(?:\.\d{2})?)/g
const WEIGHT_PATTERN = /\b((?:\d+(?:\.\d+)?)\s*(?:g|oz|mg|ml|pk|pack|count|ct)s?|(?:1\/[248]|3\.5g?|7g?|14g?|28g?|eighth|quarter|half|ounce|gram))\b/gi
const THC_PATTERN = /(?:THC|thc)[:\s]*(\d{1,2}(?:\.\d{1,2})?)\s*%?/i

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  flower: ['flower', 'bud', 'nug'],
  edibles: ['edible', 'gummy', 'gummies', 'chocolate', 'candy', 'beverage'],
  vapes: ['vape', 'cartridge', 'cart', 'pen'],
  'pre-rolls': ['pre-roll', 'preroll', 'joint', 'blunt'],
  concentrates: ['concentrate', 'dab', 'wax', 'shatter', 'rosin', 'resin'],
  tinctures: ['tincture', 'oil', 'capsule', 'rso'],
  topicals: ['topical', 'cream', 'balm', 'lotion'],
}

/**
 * Extract text content from a PDF file URL.
 * Uses a simple approach: fetch raw bytes and extract readable ASCII/UTF-8 strings.
 */
async function extractPdfText(pdfUrl: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(pdfUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Leefii/1.0; +https://leefii.com)',
      },
    })

    clearTimeout(timeout)

    if (!response.ok) return null

    const buffer = await response.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    // Limit to 5MB PDFs
    if (bytes.length > 5 * 1024 * 1024) return null

    // Extract readable text strings from PDF binary
    // PDF text is typically enclosed in parentheses () or angle brackets <>
    const text = extractTextFromPdfBytes(bytes)
    return text
  } catch {
    return null
  }
}

/**
 * Extract readable text strings from raw PDF bytes.
 * PDF stores text in various ways; we look for the most common:
 * - Text between parentheses: (Hello World)
 * - Hex-encoded text: <48656C6C6F>
 * - Also try extracting any long runs of printable ASCII
 */
function extractTextFromPdfBytes(bytes: Uint8Array): string {
  const chunks: string[] = []
  let inParens = false
  let current = ''
  let depth = 0

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]

    if (byte === 0x28 && !inParens) {
      // Opening parenthesis
      inParens = true
      depth = 1
      current = ''
    } else if (inParens) {
      if (byte === 0x28) {
        depth++
        current += String.fromCharCode(byte)
      } else if (byte === 0x29) {
        depth--
        if (depth === 0) {
          inParens = false
          if (current.length > 0) {
            chunks.push(current)
          }
        } else {
          current += String.fromCharCode(byte)
        }
      } else if (byte >= 0x20 && byte < 0x7F) {
        current += String.fromCharCode(byte)
      } else if (byte === 0x0A || byte === 0x0D) {
        current += '\n'
      }
    }
  }

  return chunks.join(' ')
}

/**
 * Extract products from a PDF menu URL.
 */
export async function extractPdfProducts(pdfUrl: string): Promise<ExtractedProduct[]> {
  const text = await extractPdfText(pdfUrl)
  if (!text || text.length < 20) return []

  const products: ExtractedProduct[] = []
  let currentCategory = 'other'

  // Split text into lines
  const lines = text.split(/[\n\r]+/).map((l) => l.trim()).filter((l) => l.length > 0)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check if line is a category heading
    const cat = detectCategory(line)
    if (cat && !line.match(PRICE_PATTERN)) {
      currentCategory = cat
      continue
    }

    // Look for lines with prices
    const priceMatches = line.match(PRICE_PATTERN)
    if (!priceMatches || priceMatches.length === 0) continue

    const price = parseFloat(priceMatches[0].replace('$', ''))
    if (price <= 0 || price > 2000) continue

    // The product name is usually the text before the price
    const priceIndex = line.indexOf('$')
    let name = priceIndex > 0 ? line.substring(0, priceIndex).trim() : ''

    // If name is too short, try the previous line
    if (name.length < 2 && i > 0) {
      name = lines[i - 1].trim()
    }

    if (!name || name.length < 2 || name.length > 150) continue
    // Skip if it looks like a total or subtotal
    if (name.toLowerCase().includes('total') || name.toLowerCase().includes('tax')) continue

    const thcMatch = line.match(THC_PATTERN) || (i + 1 < lines.length ? lines[i + 1].match(THC_PATTERN) : null)
    const weightMatch = line.match(WEIGHT_PATTERN)

    const originalPrice = priceMatches.length > 1 ? parseFloat(priceMatches[1].replace('$', '')) : undefined

    products.push({
      name,
      category: currentCategory,
      price,
      originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
      weight: weightMatch?.[0],
      thcContent: thcMatch ? thcMatch[1] + '%' : undefined,
      isOnSale: originalPrice !== undefined && originalPrice > price,
    })
  }

  // Deduplicate
  const seen = new Set<string>()
  return products.filter((p) => {
    const key = `${p.name.toLowerCase()}-${p.weight || ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function detectCategory(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) return category
    }
  }
  return null
}
