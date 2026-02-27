/**
 * Scraping orchestrator.
 * Manages batch scraping jobs with rate limiting, progress tracking,
 * error handling, and database persistence.
 */

import { prisma } from '@/lib/prisma'
import { findMenuPage } from './menu-finder'
import {
  extractDutchieProducts,
  extractJaneProducts,
  extractWeedmapsProducts,
} from './extractors/iframe-embed'
import { extractHtmlProducts } from './extractors/html-menu'
import { extractPdfProducts } from './extractors/pdf-menu'
import type { ExtractedProduct } from './extractors/iframe-embed'

export interface ScrapeOptions {
  scope: 'all' | 'state' | 'unscraped' | 'stale'
  state?: string         // State slug for scope='state'
  limit?: number         // Max dispensaries to process
  skipDetection?: boolean // Skip menu-finding, only scrape dispensaries with known menuUrl
}

export interface ScrapeProgress {
  jobId: string
  total: number
  processed: number
  succeeded: number
  failed: number
  newProducts: number
  status: 'running' | 'completed' | 'failed'
}

// Rate limit: delay between requests (ms)
const REQUEST_DELAY = 1000
// Max concurrent dispensaries being processed
const MAX_CONCURRENT = 3

/**
 * Sleep helper for rate limiting.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Run a full scraping job.
 * Returns the job ID for status tracking.
 */
export async function runScrapeJob(options: ScrapeOptions): Promise<ScrapeProgress> {
  const { scope, state, limit = 100, skipDetection = false } = options

  // Build query filter
  const where: Record<string, unknown> = { isActive: true }

  if (scope === 'state' && state) {
    const stateRecord = await prisma.state.findUnique({ where: { slug: state } })
    if (stateRecord) where.stateId = stateRecord.id
  } else if (scope === 'unscraped') {
    where.lastMenuScrape = null
    where.website = { not: null }
  } else if (scope === 'stale') {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    where.lastMenuScrape = { lt: oneDayAgo }
    where.website = { not: null }
  }

  if (scope === 'all' || !skipDetection) {
    where.website = { not: null }
  }

  if (skipDetection) {
    where.menuUrl = { not: null }
  }

  // Get dispensaries to scrape
  const dispensaries = await prisma.dispensary.findMany({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: where as any,
    select: {
      id: true,
      name: true,
      slug: true,
      website: true,
      menuUrl: true,
      menuPlatform: true,
    },
    take: limit,
    orderBy: { lastMenuScrape: { sort: 'asc', nulls: 'first' } },
  })

  // Create job record
  const job = await prisma.scrapeJob.create({
    data: {
      type: 'menu',
      platform: scope === 'state' ? state || 'all' : scope,
      status: 'running',
      totalTargets: dispensaries.length,
    },
  })

  const progress: ScrapeProgress = {
    jobId: job.id,
    total: dispensaries.length,
    processed: 0,
    succeeded: 0,
    failed: 0,
    newProducts: 0,
    status: 'running',
  }

  // Process dispensaries with concurrency control
  const errors: string[] = []

  // Process in batches
  for (let i = 0; i < dispensaries.length; i += MAX_CONCURRENT) {
    const batch = dispensaries.slice(i, i + MAX_CONCURRENT)

    const results = await Promise.allSettled(
      batch.map((dispensary) => processDispensary(dispensary, skipDetection))
    )

    for (const result of results) {
      progress.processed++

      if (result.status === 'fulfilled') {
        if (result.value.success) {
          progress.succeeded++
          progress.newProducts += result.value.newProducts
        } else {
          progress.failed++
          if (result.value.error) {
            errors.push(`${result.value.dispensaryName}: ${result.value.error}`)
          }
        }
      } else {
        progress.failed++
        errors.push(`Unexpected error: ${result.reason}`)
      }
    }

    // Update job progress
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: {
        processed: progress.processed,
        succeeded: progress.succeeded,
        failed: progress.failed,
        newProducts: progress.newProducts,
      },
    })

    // Rate limit between batches
    if (i + MAX_CONCURRENT < dispensaries.length) {
      await sleep(REQUEST_DELAY)
    }
  }

  // Finalize job
  progress.status = 'completed'
  await prisma.scrapeJob.update({
    where: { id: job.id },
    data: {
      status: 'completed',
      completedAt: new Date(),
      errorLog: errors.length > 0 ? errors.slice(0, 50).join('\n') : null,
    },
  })

  return progress
}

interface ProcessResult {
  success: boolean
  newProducts: number
  dispensaryName: string
  error?: string
}

/**
 * Process a single dispensary: find menu → extract products → save to DB.
 */
async function processDispensary(
  dispensary: {
    id: string
    name: string
    slug: string
    website: string | null
    menuUrl: string | null
    menuPlatform: string | null
  },
  skipDetection: boolean
): Promise<ProcessResult> {
  const result: ProcessResult = {
    success: false,
    newProducts: 0,
    dispensaryName: dispensary.name,
  }

  try {
    let menuUrl = dispensary.menuUrl
    let menuPlatform = dispensary.menuPlatform
    let menuPageHtml: string | null = null

    // Step 1: Find menu page (unless skipping detection)
    if (!skipDetection && dispensary.website) {
      const menuResult = await findMenuPage(dispensary.website)

      if (menuResult.error && !menuResult.menuUrl) {
        // Update dispensary to record the attempt
        await prisma.dispensary.update({
          where: { id: dispensary.id },
          data: { lastMenuScrape: new Date() },
        })
        result.error = menuResult.error
        return result
      }

      menuUrl = menuResult.menuUrl
      menuPlatform = menuResult.menuPlatform
      menuPageHtml = menuResult.menuPageHtml

      // Update dispensary with detected menu info
      await prisma.dispensary.update({
        where: { id: dispensary.id },
        data: {
          menuUrl,
          menuPlatform,
          lastMenuScrape: new Date(),
        },
      })
    }

    if (!menuUrl && !menuPageHtml) {
      result.error = 'No menu URL found'
      return result
    }

    // Step 2: Extract products based on platform
    let products: ExtractedProduct[] = []

    if (menuPlatform === 'dutchie' && menuUrl) {
      products = await extractDutchieProducts(menuUrl)
    } else if (menuPlatform === 'jane' && menuUrl) {
      products = await extractJaneProducts(menuUrl)
    } else if (menuPlatform === 'weedmaps' && menuUrl) {
      products = await extractWeedmapsProducts(menuUrl)
    } else if (menuPlatform === 'custom' && menuPageHtml) {
      products = extractHtmlProducts(menuPageHtml)
    } else if (menuUrl) {
      // Unknown platform — try HTML extraction on the menu URL
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        const response = await fetch(menuUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Leefii/1.0; +https://leefii.com)',
          },
        })
        clearTimeout(timeout)

        if (response.ok) {
          const contentType = response.headers.get('content-type') || ''
          if (contentType.includes('pdf')) {
            products = await extractPdfProducts(menuUrl)
          } else {
            const html = await response.text()
            products = extractHtmlProducts(html)
          }
        }
      } catch {
        result.error = 'Failed to fetch menu URL'
        return result
      }
    }

    if (products.length === 0) {
      result.error = 'No products extracted'
      await prisma.dispensary.update({
        where: { id: dispensary.id },
        data: { lastMenuScrape: new Date() },
      })
      return result
    }

    // Step 3: Save products to database
    // Mark existing products as inactive before upserting
    await prisma.menuProduct.updateMany({
      where: { dispensaryId: dispensary.id },
      data: { isActive: false },
    })

    let newCount = 0
    for (const product of products) {
      // Skip products with invalid prices
      if (product.price <= 0 || product.price > 10000) continue

      try {
        await prisma.menuProduct.upsert({
          where: {
            dispensaryId_name_weight: {
              dispensaryId: dispensary.id,
              name: product.name.slice(0, 255),
              weight: product.weight || '',
            },
          },
          create: {
            dispensaryId: dispensary.id,
            name: product.name.slice(0, 255),
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand?.slice(0, 255),
            strain: product.strain?.slice(0, 255),
            strainType: product.strainType,
            price: product.price,
            originalPrice: product.originalPrice,
            weight: product.weight || '',
            thcContent: product.thcContent,
            cbdContent: product.cbdContent,
            imageUrl: product.imageUrl,
            isOnSale: product.isOnSale,
            sourceUrl: menuUrl,
            sourcePlatform: menuPlatform,
            lastScrapedAt: new Date(),
            isActive: true,
          },
          update: {
            category: product.category,
            subcategory: product.subcategory,
            brand: product.brand?.slice(0, 255),
            strain: product.strain?.slice(0, 255),
            strainType: product.strainType,
            price: product.price,
            originalPrice: product.originalPrice,
            thcContent: product.thcContent,
            cbdContent: product.cbdContent,
            imageUrl: product.imageUrl,
            isOnSale: product.isOnSale,
            sourceUrl: menuUrl,
            sourcePlatform: menuPlatform,
            lastScrapedAt: new Date(),
            isActive: true,
          },
        })
        newCount++
      } catch {
        // Upsert conflict — skip this product
      }
    }

    result.success = true
    result.newProducts = newCount

    // Update dispensary scrape timestamp
    await prisma.dispensary.update({
      where: { id: dispensary.id },
      data: { lastMenuScrape: new Date() },
    })

    return result
  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error'
    return result
  }
}

/**
 * Get stats about current scraping data.
 */
export async function getScrapeStats() {
  const [
    totalProducts,
    activeProducts,
    productsByPlatform,
    productsByCategory,
    dispensariesWithMenu,
    totalDispensaries,
    recentJobs,
  ] = await Promise.all([
    prisma.menuProduct.count(),
    prisma.menuProduct.count({ where: { isActive: true } }),
    prisma.menuProduct.groupBy({
      by: ['sourcePlatform'],
      _count: true,
      where: { isActive: true },
    }),
    prisma.menuProduct.groupBy({
      by: ['category'],
      _count: true,
      where: { isActive: true },
    }),
    prisma.dispensary.count({ where: { menuUrl: { not: null } } }),
    prisma.dispensary.count({ where: { isActive: true } }),
    prisma.scrapeJob.findMany({
      orderBy: { startedAt: 'desc' },
      take: 10,
    }),
  ])

  return {
    totalProducts,
    activeProducts,
    productsByPlatform: productsByPlatform.map((p) => ({
      platform: p.sourcePlatform || 'unknown',
      count: p._count,
    })),
    productsByCategory: productsByCategory.map((c) => ({
      category: c.category,
      count: c._count,
    })),
    dispensariesWithMenu,
    totalDispensaries,
    menuCoverage: totalDispensaries > 0
      ? Math.round((dispensariesWithMenu / totalDispensaries) * 100)
      : 0,
    recentJobs,
  }
}
