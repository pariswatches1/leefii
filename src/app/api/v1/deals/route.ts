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

    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build where clause
    const where: Record<string, unknown> = { isActive: true }

    if (state) {
      where.stateSlug = state
    }
    if (city) {
      where.citySlug = city
    }
    if (type) {
      where.discountType = type
    }

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          discountType: true,
          discountValue: true,
          dispensaryName: true,
          stateSlug: true,
          citySlug: true,
          isActive: true,
          endDate: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.deal.count({ where }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: deals,
        meta: { total, limit, offset },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 deals error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
