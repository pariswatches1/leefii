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

    const type = searchParams.get('type')?.toUpperCase()
    const effect = searchParams.get('effect')
    const condition = searchParams.get('condition')
    const flavor = searchParams.get('flavor')
    const thcMin = searchParams.get('thc_min')
    const thcMax = searchParams.get('thc_max')
    const cbdMin = searchParams.get('cbd_min')
    const cbdMax = searchParams.get('cbd_max')
    const sort = searchParams.get('sort') || 'rating'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build where clause
    const where: Record<string, unknown> = { isActive: true }

    if (type && ['SATIVA', 'INDICA', 'HYBRID', 'CBD'].includes(type)) {
      where.type = type
    }
    if (effect) {
      where.effects = { has: effect }
    }
    if (condition) {
      where.conditions = { has: condition }
    }
    if (flavor) {
      where.flavors = { has: flavor }
    }
    if (thcMin) {
      where.thcMax = { ...(where.thcMax as object || {}), gte: parseFloat(thcMin) }
    }
    if (thcMax) {
      where.thcMin = { ...(where.thcMin as object || {}), lte: parseFloat(thcMax) }
    }
    if (cbdMin) {
      where.cbdMax = { ...(where.cbdMax as object || {}), gte: parseFloat(cbdMin) }
    }
    if (cbdMax) {
      where.cbdMin = { ...(where.cbdMin as object || {}), lte: parseFloat(cbdMax) }
    }

    // Build orderBy
    let orderBy: Record<string, string> = { rating: 'desc' }
    switch (sort) {
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'thc':
        orderBy = { thcMax: 'desc' }
        break
      case 'reviews':
        orderBy = { reviewsCount: 'desc' }
        break
      case 'rating':
      default:
        orderBy = { rating: 'desc' }
        break
    }

    const [strains, total] = await Promise.all([
      prisma.strain.findMany({
        where,
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
          flavors: true,
          conditions: true,
          description: true,
          difficulty: true,
        },
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.strain.count({ where }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: strains,
        meta: { total, limit, offset },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 strains error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
