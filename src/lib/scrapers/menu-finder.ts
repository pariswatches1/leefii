import * as cheerio from 'cheerio'

export interface MenuFinderResult {
  menuUrl: string | null
  menuPlatform: 'dutchie' | 'jane' | 'weedmaps' | 'custom' | null
  menuPageHtml: string | null
  error: string | null
}

// Known platform patterns in iframe/embed URLs
const PLATFORM_PATTERNS: Record<string, RegExp[]> = {
  dutchie: [
    /dutchie\.com/i,
    /dutchie-plus/i,
    /menu\.dutchie/i,
    /embedded-menu/i,
  ],
  jane: [
    /iheartjane\.com/i,
    /jane\.com/i,
    /janetechnologies/i,
  ],
  weedmaps: [
    /weedmaps\.com/i,
    /wmaps\.io/i,
  ],
}

// Words that indicate a menu/product page
const MENU_KEYWORDS: Record<string, number> = {
  menu: 10,
  'our-menu': 10,
  'shop-menu': 10,
  'dispensary-menu': 10,
  products: 8,
  shop: 8,
  'online-shop': 8,
  order: 6,
  'order-online': 7,
  'order-now': 6,
  store: 5,
  catalog: 5,
  browse: 4,
  'shop-now': 7,
  'view-menu': 10,
  'our-products': 8,
  deals: 3,
  specials: 3,
}

/**
 * Score a link based on how likely it is to be a menu page.
 */
function scoreLinkRelevance(href: string, text: string): number {
  let score = 0
  const hrefLower = href.toLowerCase()
  const textLower = text.toLowerCase().trim()

  // Score based on URL path
  for (const [keyword, weight] of Object.entries(MENU_KEYWORDS)) {
    if (hrefLower.includes(keyword)) {
      score += weight
    }
  }

  // Score based on link text
  if (textLower === 'menu' || textLower === 'our menu') score += 10
  if (textLower === 'shop' || textLower === 'shop now') score += 8
  if (textLower === 'order' || textLower === 'order online' || textLower === 'order now') score += 7
  if (textLower.includes('menu')) score += 6
  if (textLower.includes('product')) score += 5
  if (textLower.includes('shop')) score += 4
  if (textLower.includes('order')) score += 3
  if (textLower.includes('browse')) score += 2

  // Penalize non-menu pages
  if (hrefLower.includes('contact')) score -= 5
  if (hrefLower.includes('about')) score -= 5
  if (hrefLower.includes('blog')) score -= 5
  if (hrefLower.includes('career')) score -= 5
  if (hrefLower.includes('login')) score -= 10
  if (hrefLower.includes('account')) score -= 10
  if (hrefLower.includes('#')) score -= 3
  if (hrefLower.includes('mailto:')) score -= 20
  if (hrefLower.includes('tel:')) score -= 20
  if (hrefLower.includes('.pdf')) score -= 2

  return score
}

/**
 * Detect if page HTML contains a known menu platform embed.
 */
function detectPlatform(html: string): { platform: string | null; embedUrl: string | null } {
  const $ = cheerio.load(html)

  // Check iframes
  const iframes = $('iframe')
  for (let i = 0; i < iframes.length; i++) {
    const src = $(iframes[i]).attr('src') || ''
    for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(src)) {
          return { platform, embedUrl: src }
        }
      }
    }
  }

  // Check script tags and data attributes for platform signatures
  const htmlLower = html.toLowerCase()

  // Dutchie signatures
  if (htmlLower.includes('dutchie-embed') || htmlLower.includes('dutchie.com/embedded-menu')) {
    const dutchieMatch = html.match(/(?:src|href)=["'](https?:\/\/[^"']*dutchie[^"']*)/i)
    return { platform: 'dutchie', embedUrl: dutchieMatch?.[1] || null }
  }

  // Jane signatures
  if (htmlLower.includes('iheartjane.com/embed') || htmlLower.includes('jane-frame')) {
    const janeMatch = html.match(/(?:src|href)=["'](https?:\/\/[^"']*iheartjane[^"']*)/i)
    return { platform: 'jane', embedUrl: janeMatch?.[1] || null }
  }

  // Weedmaps signatures
  if (htmlLower.includes('weedmaps.com/deliveries') || htmlLower.includes('weedmaps-embed')) {
    const wmMatch = html.match(/(?:src|href)=["'](https?:\/\/[^"']*weedmaps[^"']*)/i)
    return { platform: 'weedmaps', embedUrl: wmMatch?.[1] || null }
  }

  return { platform: null, embedUrl: null }
}

/**
 * Resolve a relative URL against a base URL.
 */
function resolveUrl(base: string, relative: string): string | null {
  try {
    return new URL(relative, base).href
  } catch {
    return null
  }
}

/**
 * Fetch a URL with timeout and error handling.
 */
async function safeFetch(url: string, timeoutMs = 15000): Promise<{ html: string; finalUrl: string } | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Leefii/1.0; +https://leefii.com)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })

    clearTimeout(timeout)

    if (!response.ok) return null

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      return null
    }

    const html = await response.text()
    return { html, finalUrl: response.url }
  } catch {
    return null
  }
}

/**
 * Find the menu page and detect the platform for a dispensary website.
 *
 * 1. Fetch the homepage
 * 2. Scan for iframes / platform embeds on the homepage
 * 3. If none found, score all links and follow the best candidate
 * 4. Check the candidate page for embeds or product content
 */
export async function findMenuPage(websiteUrl: string): Promise<MenuFinderResult> {
  // Normalize URL
  let baseUrl = websiteUrl.trim()
  if (!baseUrl.startsWith('http')) {
    baseUrl = 'https://' + baseUrl
  }

  // 1. Fetch homepage
  const homepage = await safeFetch(baseUrl)
  if (!homepage) {
    return { menuUrl: null, menuPlatform: null, menuPageHtml: null, error: 'Failed to fetch homepage' }
  }

  // 2. Check homepage for platform embeds
  const homeDetection = detectPlatform(homepage.html)
  if (homeDetection.platform) {
    return {
      menuUrl: homeDetection.embedUrl || homepage.finalUrl,
      menuPlatform: homeDetection.platform as MenuFinderResult['menuPlatform'],
      menuPageHtml: homepage.html,
      error: null,
    }
  }

  // 3. Score all links on the homepage
  const $ = cheerio.load(homepage.html)
  const candidates: Array<{ href: string; score: number; text: string }> = []

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const text = $(el).text() || ''
    const resolved = resolveUrl(homepage.finalUrl, href)
    if (!resolved) return

    // Only follow links on the same domain
    try {
      const baseHost = new URL(homepage.finalUrl).hostname.replace('www.', '')
      const linkHost = new URL(resolved).hostname.replace('www.', '')
      if (baseHost !== linkHost) return
    } catch {
      return
    }

    const score = scoreLinkRelevance(resolved, text)
    if (score > 0) {
      candidates.push({ href: resolved, score, text })
    }
  })

  // Also try common menu URL paths directly
  const commonPaths = ['/menu', '/products', '/shop', '/order', '/online-menu', '/dispensary-menu']
  for (const path of commonPaths) {
    const testUrl = resolveUrl(homepage.finalUrl, path)
    if (testUrl) {
      candidates.push({ href: testUrl, score: 8, text: '' })
    }
  }

  // Sort by score descending, deduplicate
  const seen = new Set<string>()
  const sorted = candidates
    .sort((a, b) => b.score - a.score)
    .filter((c) => {
      if (seen.has(c.href)) return false
      seen.add(c.href)
      return true
    })

  // 4. Try top 3 candidates
  for (const candidate of sorted.slice(0, 3)) {
    const menuPage = await safeFetch(candidate.href)
    if (!menuPage) continue

    // Check for platform embed on menu page
    const menuDetection = detectPlatform(menuPage.html)
    if (menuDetection.platform) {
      return {
        menuUrl: menuDetection.embedUrl || menuPage.finalUrl,
        menuPlatform: menuDetection.platform as MenuFinderResult['menuPlatform'],
        menuPageHtml: menuPage.html,
        error: null,
      }
    }

    // Check if the page looks like a custom menu (has product-like content)
    const menuHtml = menuPage.html.toLowerCase()
    const hasProducts = (
      (menuHtml.match(/\$\d{1,3}(?:\.\d{2})?/g) || []).length >= 3 && // At least 3 prices
      (menuHtml.includes('flower') || menuHtml.includes('edible') || menuHtml.includes('vape') ||
       menuHtml.includes('pre-roll') || menuHtml.includes('concentrate') || menuHtml.includes('thc'))
    )

    if (hasProducts) {
      return {
        menuUrl: menuPage.finalUrl,
        menuPlatform: 'custom',
        menuPageHtml: menuPage.html,
        error: null,
      }
    }
  }

  // No menu found
  return { menuUrl: null, menuPlatform: null, menuPageHtml: null, error: 'No menu page found' }
}
