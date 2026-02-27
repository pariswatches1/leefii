import { NextRequest, NextResponse } from 'next/server'
import { runScrapeJob, getScrapeStats } from '@/lib/scrapers/orchestrator'

/**
 * GET /api/admin/scrape — Get scraping stats and recent job history.
 */
export async function GET() {
  try {
    const stats = await getScrapeStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get stats' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/scrape — Trigger a new scrape job.
 *
 * Body:
 * {
 *   scope: "all" | "state" | "unscraped" | "stale",
 *   state?: string,     // State slug (when scope="state")
 *   limit?: number,     // Max dispensaries to process (default: 100)
 *   skipDetection?: boolean  // Skip menu finding, only scrape known menuUrls
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { scope = 'unscraped', state, limit = 100, skipDetection = false } = body

    // Validate scope
    if (!['all', 'state', 'unscraped', 'stale'].includes(scope)) {
      return NextResponse.json(
        { error: 'Invalid scope. Must be: all, state, unscraped, or stale' },
        { status: 400 }
      )
    }

    if (scope === 'state' && !state) {
      return NextResponse.json(
        { error: 'State slug required when scope is "state"' },
        { status: 400 }
      )
    }

    // Cap limit to prevent abuse
    const safeLimit = Math.min(Math.max(1, limit), 500)

    // Run the scrape job (this runs async but we return immediately with job ID)
    // For now, we run synchronously for simplicity — can be moved to a queue later
    const progress = await runScrapeJob({
      scope,
      state,
      limit: safeLimit,
      skipDetection,
    })

    return NextResponse.json({
      success: true,
      job: progress,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start scrape job' },
      { status: 500 }
    )
  }
}
