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
    const telehealth = searchParams.get('telehealth')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build where clause
    const where: Record<string, unknown> = { isActive: true }

    if (state) {
      where.state = state
    }
    if (city) {
      where.city = city
    }
    if (telehealth === 'true') {
      where.telemedicine = true
    } else if (telehealth === 'false') {
      where.telemedicine = false
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          email: true,
          website: true,
          address: true,
          city: true,
          state: true,
          specialties: true,
          acceptsInsurance: true,
          telemedicine: true,
          rating: true,
          reviewsCount: true,
        },
        orderBy: { rating: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.doctor.count({ where }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: doctors.map((d) => ({
          ...d,
          isTelehealth: d.telemedicine,
        })),
        meta: { total, limit, offset },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 doctors error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
