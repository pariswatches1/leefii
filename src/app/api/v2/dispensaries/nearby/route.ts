import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

async function zipToCoords(zip: string): Promise<{ lat: number; lng: number } | null> {
  const dispensary = await prisma.dispensary.findFirst({
    where: { zipCode: zip, isActive: true },
    select: { latitude: true, longitude: true },
  })
  if (dispensary) return { lat: dispensary.latitude, lng: dispensary.longitude }

  const city = await prisma.city.findFirst({
    where: { dispensaries: { some: { zipCode: zip } } },
    select: { latitude: true, longitude: true },
  })
  if (city?.latitude && city?.longitude) return { lat: city.latitude, lng: city.longitude }

  return null
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    let lat = params.get('lat') ? parseFloat(params.get('lat')!) : null
    let lng = params.get('lng') ? parseFloat(params.get('lng')!) : null
    const zip = params.get('zip')

    if (!lat && !lng && zip) {
      const coords = await zipToCoords(zip)
      if (coords) {
        lat = coords.lat
        lng = coords.lng
      }
    }

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Location required.' }, { status: 400 })
    }

    const radius = Math.min(parseFloat(params.get('radius') || '25'), 100)

    const latDelta = radius / 69
    const lngDelta = radius / (69 * Math.cos((lat * Math.PI) / 180))

    const dispensaries = await prisma.dispensary.findMany({
      where: {
        isActive: true,
        latitude: { gte: lat - latDelta, lte: lat + latDelta },
        longitude: { gte: lng - lngDelta, lte: lng + lngDelta },
      },
      include: {
        city: { select: { name: true } },
        state: { select: { abbreviation: true } },
        BusinessHours: true,
      },
    })

    // Compute distances, filter by radius
    const withDistance = dispensaries.map((d) => ({
      ...d,
      distance: haversineDistance(lat!, lng!, d.latitude, d.longitude),
    }))
    const nearby = withDistance.filter((d) => d.distance <= radius)

    if (nearby.length === 0) {
      return NextResponse.json({ dispensaries: [], total: 0 })
    }

    const dispensaryIds = nearby.map((d) => d.id)

    // Get product counts and price stats per dispensary
    const priceStats = await prisma.menuProduct.groupBy({
      by: ['dispensaryId'],
      where: { dispensaryId: { in: dispensaryIds }, isActive: true },
      _min: { price: true },
      _avg: { price: true },
      _count: true,
    })

    const priceMap = new Map(priceStats.map((s) => [s.dispensaryId, s]))

    // Only include dispensaries that have menu products
    const withProducts = nearby.filter((d) => {
      const stats = priceMap.get(d.id)
      return stats && stats._count > 0
    })

    // Sort by product count descending
    withProducts.sort((a, b) => {
      const countA = priceMap.get(a.id)?._count || 0
      const countB = priceMap.get(b.id)?._count || 0
      return countB - countA
    })

    // Check open status
    const now = new Date()
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    const today = days[now.getDay()]

    const result = withProducts.map((d) => {
      const stats = priceMap.get(d.id)
      let isOpen = false
      if (d.BusinessHours) {
        const todayHours = d.BusinessHours.find((h: { dayOfWeek: string }) => h.dayOfWeek === today)
        if (todayHours && !todayHours.isClosed) {
          const currentTime = now.getHours() * 100 + now.getMinutes()
          const openTime = parseInt(todayHours.openTime.replace(':', ''))
          const closeTime = parseInt(todayHours.closeTime.replace(':', ''))
          isOpen = currentTime >= openTime && currentTime <= closeTime
        }
      }

      return {
        id: d.id,
        name: d.name,
        slug: d.slug,
        distance: Math.round(d.distance * 10) / 10,
        rating: d.rating || 0,
        reviewsCount: d.reviewsCount || 0,
        city: d.city?.name || '',
        state: d.state?.abbreviation || '',
        address: d.address,
        phone: d.phone,
        hasDelivery: d.hasDelivery,
        hasStorefront: d.hasStorefront,
        licenseType: d.licenseType,
        isOpen,
        productCount: stats?._count || 0,
        lowestPrice: stats?._min?.price || null,
        avgPrice: stats?._avg?.price ? Math.round(stats._avg.price * 100) / 100 : null,
      }
    })

    return NextResponse.json({ dispensaries: result, total: result.length })
  } catch (error) {
    console.error('Nearby dispensaries API error:', error)
    return NextResponse.json({ error: 'Failed to fetch dispensaries' }, { status: 500 })
  }
}
