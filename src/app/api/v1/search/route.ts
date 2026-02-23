import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'X-Powered-By': 'Leefii Cannabis API',
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams

    const q = searchParams.get('q')
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100)

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query parameter "q" is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    const searchTerm = q.trim()
    const searchTypes = type ? [type.toLowerCase()] : ['strain', 'dispensary', 'deal']

    const results: Record<string, unknown[]> = {}

    if (searchTypes.includes('strain')) {
      const strains = await prisma.strain.findMany({
        where: {
          isActive: true,
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          slug: true,
          name: true,
          type: true,
          thcMin: true,
          thcMax: true,
          cbdMin: true,
          cbdMax: true,
          rating: true,
          reviewsCount: true,
          effects: true,
        },
        orderBy: { rating: 'desc' },
        take: limit,
      })
      results.strains = strains
    }

    if (searchTypes.includes('dispensary')) {
      const dispensaries = await prisma.dispensary.findMany({
        where: {
          isActive: true,
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          address: true,
          rating: true,
          reviewsCount: true,
          hasDelivery: true,
          city: { select: { name: true } },
          state: { select: { name: true, slug: true } },
        },
        orderBy: { rating: 'desc' },
        take: limit,
      })
      results.dispensaries = dispensaries
    }

    if (searchTypes.includes('deal')) {
      const deals = await prisma.deal.findMany({
        where: {
          isActive: true,
          title: { contains: searchTerm, mode: 'insensitive' },
        },
        select: {
          id: true,
          title: true,
          description: true,
          discountType: true,
          discountValue: true,
          dispensaryName: true,
          stateSlug: true,
          citySlug: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })
      results.deals = deals
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        meta: {
          query: searchTerm,
          type: type || 'all',
          limit,
        },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 search error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
