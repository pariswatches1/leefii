/**
 * Extractor for dispensary websites using embedded menu platforms
 * (Dutchie, Jane, Weedmaps).
 *
 * These platforms expose public JSON APIs that their embeds consume.
 * We hit those same endpoints to get structured product data.
 */

export interface ExtractedProduct {
  name: string
  category: string
  subcategory?: string
  brand?: string
  strain?: string
  strainType?: string
  price: number
  originalPrice?: number
  weight?: string
  thcContent?: string
  cbdContent?: string
  imageUrl?: string
  isOnSale: boolean
}

/**
 * Extract products from a Dutchie embedded menu.
 * Dutchie menus expose a GraphQL / REST endpoint that returns product data.
 */
export async function extractDutchieProducts(embedUrl: string): Promise<ExtractedProduct[]> {
  const products: ExtractedProduct[] = []

  try {
    // Extract the retailer slug from Dutchie embed URL
    // Formats: dutchie.com/embedded-menu/{slug}, {slug}.dutchie.com, etc.
    let slug: string | null = null

    const embeddedMatch = embedUrl.match(/embedded-menu\/([^/?#]+)/i)
    if (embeddedMatch) slug = embeddedMatch[1]

    if (!slug) {
      const subdomainMatch = embedUrl.match(/https?:\/\/([^.]+)\.dutchie\.com/i)
      if (subdomainMatch && subdomainMatch[1] !== 'www' && subdomainMatch[1] !== 'api') {
        slug = subdomainMatch[1]
      }
    }

    if (!slug) return products

    // Try Dutchie's public API endpoint for menu data
    // The embedded menus fetch from: https://dutchie.com/graphql
    const apiUrl = `https://dutchie.com/api/v2/menu/${slug}`
    const response = await fetchWithTimeout(apiUrl, 20000)
    if (!response) {
      // Fallback: try to scrape the embedded menu HTML directly
      return await scrapeDutchieHtml(embedUrl)
    }

    const data = await response.json()
    if (data?.products && Array.isArray(data.products)) {
      for (const p of data.products) {
        products.push(normalizeProduct(p, 'dutchie'))
      }
    }
  } catch {
    // If API fails, try HTML scraping as fallback
    return await scrapeDutchieHtml(embedUrl)
  }

  return products
}

/**
 * Fallback: scrape Dutchie embedded menu HTML for products.
 */
async function scrapeDutchieHtml(url: string): Promise<ExtractedProduct[]> {
  const products: ExtractedProduct[] = []
  try {
    const response = await fetchWithTimeout(url, 20000)
    if (!response) return products

    const html = await response.text()
    // Dutchie embeds often have product data in __NEXT_DATA__ or similar
    const nextDataMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
    if (nextDataMatch) {
      try {
        const data = JSON.parse(nextDataMatch[1])
        const productData = findProductsInObject(data)
        for (const p of productData) {
          products.push(normalizeProduct(p, 'dutchie'))
        }
      } catch {
        // JSON parse failed
      }
    }

    // Also try looking for JSON in script tags
    const jsonScripts = html.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g)
    if (jsonScripts) {
      for (const script of jsonScripts) {
        const content = script.replace(/<\/?script[^>]*>/g, '')
        try {
          const data = JSON.parse(content)
          const productData = findProductsInObject(data)
          for (const p of productData) {
            products.push(normalizeProduct(p, 'dutchie'))
          }
        } catch {
          // Not valid JSON
        }
      }
    }
  } catch {
    // Fetch failed
  }

  return products
}

/**
 * Extract products from a Jane/iHeartJane embedded menu.
 * Jane exposes a REST API: api.iheartjane.com/v1/stores/{id}/products
 */
export async function extractJaneProducts(embedUrl: string): Promise<ExtractedProduct[]> {
  const products: ExtractedProduct[] = []

  try {
    // Extract store ID from Jane embed URL
    // Format: iheartjane.com/embed/{storeId} or iheartjane.com/stores/{storeId}
    const storeMatch = embedUrl.match(/(?:embed|stores)\/(\d+)/i)
    if (!storeMatch) return products

    const storeId = storeMatch[1]
    const apiUrl = `https://api.iheartjane.com/v1/stores/${storeId}/products?limit=500`

    const response = await fetchWithTimeout(apiUrl, 20000)
    if (!response) return products

    const data = await response.json()
    if (data?.data && Array.isArray(data.data)) {
      for (const p of data.data) {
        products.push(normalizeProduct(p, 'jane'))
      }
    } else if (Array.isArray(data)) {
      for (const p of data) {
        products.push(normalizeProduct(p, 'jane'))
      }
    }
  } catch {
    // API failed
  }

  return products
}

/**
 * Extract products from a Weedmaps menu page.
 * Weedmaps has public-facing listing pages with menu data.
 */
export async function extractWeedmapsProducts(embedUrl: string): Promise<ExtractedProduct[]> {
  const products: ExtractedProduct[] = []

  try {
    // Extract listing slug from Weedmaps URL
    // Format: weedmaps.com/dispensaries/{slug} or weedmaps.com/deliveries/{slug}
    const slugMatch = embedUrl.match(/(?:dispensaries|deliveries)\/([^/?#]+)/i)
    if (!slugMatch) return products

    const slug = slugMatch[1]
    // Try the Weedmaps discovery API
    const apiUrl = `https://api-g.weedmaps.com/discovery/v2/listings/by_slug/${slug}/menu_items?page_size=150`

    const response = await fetchWithTimeout(apiUrl, 20000)
    if (!response) return products

    const data = await response.json()
    const menuItems = data?.data?.menu_items || data?.menu_items || []

    if (Array.isArray(menuItems)) {
      for (const p of menuItems) {
        products.push(normalizeProduct(p, 'weedmaps'))
      }
    }
  } catch {
    // API failed
  }

  return products
}

/**
 * Normalize product data from different platform formats into our standard shape.
 */
function normalizeProduct(raw: Record<string, unknown>, platform: string): ExtractedProduct {
  // Common field mappings across platforms
  const name = String(
    raw.name || raw.product_name || raw.title || raw.productName || 'Unknown Product'
  )

  const category = normalizeCategory(
    String(raw.category || raw.product_category || raw.type || raw.kind || raw.root_type || '')
  )

  const subcategory = raw.subcategory || raw.sub_category || raw.product_subcategory
    ? String(raw.subcategory || raw.sub_category || raw.product_subcategory)
    : undefined

  const brand = raw.brand || raw.brand_name || raw.brandName
    ? String(raw.brand || raw.brand_name || raw.brandName)
    : undefined

  const strain = raw.strain || raw.strain_name || raw.strainName
    ? String(raw.strain || raw.strain_name || raw.strainName)
    : undefined

  const strainType = raw.strain_type || raw.strainType || raw.genetics
    ? normalizeStrainType(String(raw.strain_type || raw.strainType || raw.genetics))
    : undefined

  // Price extraction (handle nested price objects)
  let price = 0
  let originalPrice: number | undefined
  if (typeof raw.price === 'number') {
    price = raw.price
  } else if (typeof raw.price === 'string') {
    price = parseFloat(raw.price) || 0
  } else if (raw.prices && typeof raw.prices === 'object') {
    // Handle price arrays (e.g., Dutchie price tiers)
    const priceObj = raw.prices as Record<string, unknown>
    const priceValues = Object.values(priceObj).filter((v) => typeof v === 'number') as number[]
    price = priceValues.length > 0 ? Math.min(...priceValues) : 0
  }

  if (raw.original_price || raw.originalPrice || raw.compare_at_price) {
    const origVal = raw.original_price || raw.originalPrice || raw.compare_at_price
    originalPrice = typeof origVal === 'number' ? origVal : parseFloat(String(origVal)) || undefined
  }

  const isOnSale = originalPrice !== undefined && originalPrice > price

  // Weight
  const weight = raw.weight || raw.quantity || raw.size
    ? String(raw.weight || raw.quantity || raw.size)
    : undefined

  // THC/CBD
  const thcContent = extractPotency(raw, 'thc')
  const cbdContent = extractPotency(raw, 'cbd')

  // Image
  const imageUrl = raw.image || raw.image_url || raw.imageUrl || raw.photo || raw.avatar_image_url
    ? String(raw.image || raw.image_url || raw.imageUrl || raw.photo || raw.avatar_image_url)
    : undefined

  return {
    name,
    category,
    subcategory,
    brand,
    strain,
    strainType,
    price,
    originalPrice,
    weight,
    thcContent,
    cbdContent,
    imageUrl,
    isOnSale,
  }
}

/**
 * Normalize category strings into our standard categories.
 */
function normalizeCategory(raw: string): string {
  const lower = raw.toLowerCase()
  if (lower.includes('flower') || lower.includes('bud')) return 'flower'
  if (lower.includes('edible') || lower.includes('gumm') || lower.includes('chocolate') || lower.includes('beverage')) return 'edibles'
  if (lower.includes('vape') || lower.includes('cart') || lower.includes('pen')) return 'vapes'
  if (lower.includes('pre-roll') || lower.includes('preroll') || lower.includes('joint')) return 'pre-rolls'
  if (lower.includes('concentrate') || lower.includes('dab') || lower.includes('wax') || lower.includes('shatter') || lower.includes('rosin') || lower.includes('resin')) return 'concentrates'
  if (lower.includes('tincture') || lower.includes('oil') || lower.includes('capsule')) return 'tinctures'
  if (lower.includes('topical') || lower.includes('cream') || lower.includes('balm') || lower.includes('lotion')) return 'topicals'
  if (lower.includes('accessori') || lower.includes('gear') || lower.includes('pipe')) return 'accessories'
  return raw.toLowerCase() || 'other'
}

/**
 * Normalize strain type.
 */
function normalizeStrainType(raw: string): string | undefined {
  const lower = raw.toLowerCase()
  if (lower.includes('indica')) return 'indica'
  if (lower.includes('sativa')) return 'sativa'
  if (lower.includes('hybrid')) return 'hybrid'
  return undefined
}

/**
 * Extract THC or CBD potency from various field formats.
 */
function extractPotency(raw: Record<string, unknown>, type: 'thc' | 'cbd'): string | undefined {
  const fields = type === 'thc'
    ? ['thc', 'thc_content', 'thcContent', 'thc_percentage', 'thcPercentage']
    : ['cbd', 'cbd_content', 'cbdContent', 'cbd_percentage', 'cbdPercentage']

  for (const field of fields) {
    const val = raw[field]
    if (val !== undefined && val !== null && val !== '' && val !== 0) {
      const str = String(val)
      // If it's just a number, add %
      if (/^\d+(\.\d+)?$/.test(str)) {
        return str + '%'
      }
      return str
    }
  }

  return undefined
}

/**
 * Recursively search an object for arrays that look like product lists.
 */
function findProductsInObject(obj: unknown, depth = 0): Record<string, unknown>[] {
  if (depth > 8) return []
  if (!obj || typeof obj !== 'object') return []

  if (Array.isArray(obj)) {
    // Check if this array looks like products
    if (obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
      const first = obj[0] as Record<string, unknown>
      if (
        ('name' in first || 'product_name' in first || 'title' in first) &&
        ('price' in first || 'prices' in first)
      ) {
        return obj as Record<string, unknown>[]
      }
    }
    // Search within array items
    for (const item of obj) {
      const found = findProductsInObject(item, depth + 1)
      if (found.length > 0) return found
    }
    return []
  }

  // Search object values
  for (const value of Object.values(obj as Record<string, unknown>)) {
    const found = findProductsInObject(value, depth + 1)
    if (found.length > 0) return found
  }

  return []
}

/**
 * Fetch with timeout helper.
 */
async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Leefii/1.0; +https://leefii.com)',
        Accept: 'application/json, text/html',
      },
    })

    clearTimeout(timeout)
    if (!response.ok) return null
    return response
  } catch {
    return null
  }
}
