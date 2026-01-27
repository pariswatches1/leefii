import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEARCH_CONFIG } from '@/lib/search/search-config';

/**
 * POST /api/v2/search/analytics
 * Track search-related analytics events
 *
 * Body:
 * - type: 'search' | 'suggestion_click' | 'zero_results'
 * - query: search query
 * - resultType?: type of result clicked
 * - resultId?: id of result clicked
 * - timestamp: ISO timestamp
 */
export async function POST(request: NextRequest) {
  // Don't fail loudly - analytics should be fire-and-forget
  if (!SEARCH_CONFIG.analytics.enabled) {
    return NextResponse.json({ ok: true });
  }

  try {
    const body = await request.json();
    const { type, query, resultType, resultId, timestamp } = body;

    if (!type || !query) {
      return NextResponse.json({ ok: true }); // Don't fail on bad data
    }

    const date = new Date(new Date(timestamp || Date.now()).toISOString().split('T')[0]);

    switch (type) {
      case 'suggestion_click':
        if (SEARCH_CONFIG.analytics.trackSuggestionClicks) {
          // Track which suggestions get clicked
          await prisma.pageView.upsert({
            where: {
              path_date: {
                path: `suggestion_click:${resultType}:${query.toLowerCase().trim()}`,
                date,
              },
            },
            update: { viewCount: { increment: 1 } },
            create: {
              path: `suggestion_click:${resultType}:${query.toLowerCase().trim()}`,
              date,
              viewCount: 1,
            },
          });
        }
        break;

      case 'zero_results':
        if (SEARCH_CONFIG.analytics.trackZeroResults) {
          await prisma.pageView.upsert({
            where: {
              path_date: {
                path: `zero_results:${query.toLowerCase().trim()}`,
                date,
              },
            },
            update: { viewCount: { increment: 1 } },
            create: {
              path: `zero_results:${query.toLowerCase().trim()}`,
              date,
              viewCount: 1,
            },
          });
        }
        break;

      case 'search':
        if (SEARCH_CONFIG.analytics.trackPopularSearches) {
          await prisma.pageView.upsert({
            where: {
              path_date: {
                path: `search:${query.toLowerCase().trim()}`,
                date,
              },
            },
            update: { viewCount: { increment: 1 } },
            create: {
              path: `search:${query.toLowerCase().trim()}`,
              date,
              viewCount: 1,
            },
          });
        }
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log but don't fail
    console.error('Search analytics error:', error);
    return NextResponse.json({ ok: true });
  }
}

/**
 * GET /api/v2/search/analytics
 * Get search analytics summary (admin only - for future use)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get popular searches
    const popularSearches = await prisma.pageView.findMany({
      where: {
        path: { startsWith: 'search:' },
        date: { gte: startDate },
      },
      orderBy: { viewCount: 'desc' },
      take: 20,
    });

    // Get zero result queries
    const zeroResults = await prisma.pageView.findMany({
      where: {
        path: { startsWith: 'zero_results:' },
        date: { gte: startDate },
      },
      orderBy: { viewCount: 'desc' },
      take: 20,
    });

    // Get suggestion clicks by type
    const suggestionClicks = await prisma.pageView.findMany({
      where: {
        path: { startsWith: 'suggestion_click:' },
        date: { gte: startDate },
      },
      orderBy: { viewCount: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      period: { days, startDate: startDate.toISOString() },
      popularSearches: popularSearches.map((p) => ({
        query: p.path.replace('search:', ''),
        count: p.viewCount,
      })),
      zeroResults: zeroResults.map((p) => ({
        query: p.path.replace('zero_results:', ''),
        count: p.viewCount,
      })),
      suggestionClicks: suggestionClicks.map((p) => {
        const parts = p.path.replace('suggestion_click:', '').split(':');
        return {
          type: parts[0],
          query: parts.slice(1).join(':'),
          count: p.viewCount,
        };
      }),
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
