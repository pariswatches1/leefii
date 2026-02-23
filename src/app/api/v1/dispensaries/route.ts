import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'X-Powered-By': 'Leefii Cannabis API',
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams

    const state = searchParams.get('state')
    const city = searchParams.get('city')
    const zip = searchParams.get('zip')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = parseFloat(searchParams.get('radius') || '25')
    const type = searchParams.get('type')?.toUpperCase()
    const delivery = searchParams.get('delivery')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Build where clause
    const where: Record<string, unknown> = { isActive: true }

    if (state) {
      where.state = { slug: state }
    }
    if (city) {
      where.city = { slug: city }
    }
    if (zip) {
      where.zipCode = zip
    }
    if (type) {
      const licenseMap: Record<string, string> = {
        RECREATIONAL: 'RECREATIONAL',
        MEDICAL: 'MEDICAL',
        BOTH: 'BOTH',
      }
      if (licenseMap[type]) {
        where.licenseType = licenseMap[type]
      }
    }
    if (delivery === 'true') {
      where.hasDelivery = true
    } else if (delivery === 'false') {
      where.hasDelivery = false
    }

    const select = {
      id: true,
      name: true,
      slug: true,
      address: true,
      zipCode: true,
      latitude: true,
      longitude: true,
      phone: true,
      website: true,
      hasDelivery: true,
      hasStorefront: true,
      licenseType: true,
      isVerified: true,
      rating: true,
      reviewsCount: true,
      city: { select: { name: true } },
      state: { select: { name: true, slug: true } },
    }

    // If lat/lng provided, do radius filtering
    if (lat && lng) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)

      // Rough bounding box to narrow query (1 degree ~ 69 miles)
      const latDelta = radius / 69
      const lngDelta = radius / (69 * Math.cos((userLat * Math.PI) / 180))

      where.latitude = { gte: userLat - latDelta, lte: userLat + latDelta }
      where.longitude = { gte: userLng - lngDelta, lte: userLng + lngDelta }

      const dispensaries = await prisma.dispensary.findMany({
        where,
        select,
      })

      // Calculate actual distance and filter
      const filtered = dispensaries
        .map((d) => ({
          ...d,
          distance: Math.round(
            calculateDistance(userLat, userLng, d.latitude, d.longitude) * 10
          ) / 10,
        }))
        .filter((d) => d.distance <= radius)
        .sort((a, b) => a.distance - b.distance)

      const total = filtered.length
      const paged = filtered.slice(offset, offset + limit)

      return NextResponse.json(
        {
          success: true,
          data: paged,
          meta: { total, limit, offset },
        },
        { headers: CORS_HEADERS }
      )
    }

    // Standard paginated query
    const [dispensaries, total] = await Promise.all([
      prisma.dispensary.findMany({
        where,
        select,
        orderBy: { rating: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.dispensary.count({ where }),
    ])

    return NextResponse.json(
      {
        success: true,
        data: dispensaries,
        meta: { total, limit, offset },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 dispensaries error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
