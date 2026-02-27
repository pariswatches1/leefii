import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/deals/nearby?lat=...&lng=...&limit=6
 *
 * Returns deals near the user's location.
 * Strategy:
 *   1. Find nearby dispensaries (Haversine within radius)
 *   2. Return deals matching those dispensary slugs
 *   3. Fallback: match by state slug if no dispensary-level matches
 */

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat') || '0')
    const lng = parseFloat(searchParams.get('lng') || '0')
    const radius = parseFloat(searchParams.get('radius') || '50')
    const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 24)

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // 1. Find nearby dispensary slugs
    const dispensaries = await prisma.dispensary.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        latitude: true,
        longitude: true,
        city: { select: { slug: true } },
        state: { select: { slug: true, name: true } },
      },
    })

    const nearby = dispensaries
      .filter((d) => d.latitude && d.longitude)
      .map((d) => ({
        slug: d.slug,
        citySlug: d.city.slug,
        stateSlug: d.state.slug,
        stateName: d.state.name,
        distance: calculateDistance(lat, lng, d.latitude!, d.longitude!),
      }))
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    if (nearby.length === 0) {
      return NextResponse.json({ deals: [], total: 0, location: null })
    }

    // Get unique dispensary slugs and city/state info from nearest
    const nearbySlugs = nearby.slice(0, 200).map((d) => d.slug)
    const nearestCity = nearby[0].citySlug
    const nearestState = nearby[0].stateSlug
    const nearestStateName = nearby[0].stateName

    const now = new Date()

    // 2. Query deals from nearby dispensaries
    const deals = await prisma.deal.findMany({
      where: {
        isActive: true,
        dispensarySlug: { in: nearbySlugs },
        OR: [
          { endDate: { gte: now } },
          { isOngoing: true },
          { endDate: null },
        ],
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    // 3. If not enough deals, also fetch from the same state
    let finalDeals = deals
    if (deals.length < limit) {
      const existingIds = deals.map((d) => d.id)
      const stateDeals = await prisma.deal.findMany({
        where: {
          isActive: true,
          stateSlug: nearestState,
          id: { notIn: existingIds },
          OR: [
            { endDate: { gte: now } },
            { isOngoing: true },
            { endDate: null },
          ],
        },
        orderBy: [
          { citySlug: nearestCity === null ? 'asc' : 'asc' },
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit - deals.length,
      })
      finalDeals = [...deals, ...stateDeals]
    }

    return NextResponse.json({
      deals: finalDeals.map((d) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        description: d.description,
        discountType: d.discountType,
        discountValue: d.discountValue,
        dispensaryName: d.dispensaryName,
        dispensarySlug: d.dispensarySlug,
        stateSlug: d.stateSlug,
        citySlug: d.citySlug,
        isOngoing: d.isOngoing,
        endDate: d.endDate,
        code: d.code,
        isFeatured: d.isFeatured,
      })),
      total: finalDeals.length,
      location: {
        stateSlug: nearestState,
        stateName: nearestStateName,
        citySlug: nearestCity,
      },
    })
  } catch (error) {
    console.error('Nearby deals error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby deals' },
      { status: 500 }
    )
  }
}
