import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Haversine distance calculation (miles).
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Simple ZIP code → lat/lng lookup for major areas (expandable)
// In production, use a geocoding API or database table
async function zipToCoords(zip: string): Promise<{ lat: number; lng: number } | null> {
  // Try to find a dispensary with this ZIP to get approximate coordinates
  const dispensary = await prisma.dispensary.findFirst({
    where: { zipCode: zip, isActive: true },
    select: { latitude: true, longitude: true },
  })
  if (dispensary) {
    return { lat: dispensary.latitude, lng: dispensary.longitude }
  }

  // Try city coordinates from the database
  const city = await prisma.city.findFirst({
    where: { dispensaries: { some: { zipCode: zip } } },
    select: { latitude: true, longitude: true },
  })
  if (city?.latitude && city?.longitude) {
    return { lat: city.latitude, lng: city.longitude }
  }

  return null
}

/**
 * GET /api/v2/products — Price comparison API.
 *
 * Query params:
 *   lat, lng — user coordinates
 *   zip — OR zip code (geocoded to lat/lng)
 *   radius — search radius in miles (default: 25)
 *   category — filter by category
 *   sort — price_asc (default), price_desc, distance, rating
 *   q — search query (product name, brand, strain)
 *   maxPrice — price ceiling
 *   brand — brand filter
 *   weight — weight filter
 *   strainType — indica, sativa, hybrid
 *   onSale — only show sale items
 *   page, limit — pagination
 */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    // Location
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
      return NextResponse.json(
        { error: 'Location required. Provide lat/lng or zip.' },
        { status: 400 }
      )
    }

    const radius = Math.min(parseFloat(params.get('radius') || '25'), 100)
    const category = params.get('category')
    const sort = params.get('sort') || 'price_asc'
    const q = params.get('q')
    const maxPrice = params.get('maxPrice') ? parseFloat(params.get('maxPrice')!) : null
    const brand = params.get('brand')
    const weight = params.get('weight')
    const strainType = params.get('strainType')
    const onSale = params.get('onSale') === 'true'
    const page = Math.max(parseInt(params.get('page') || '1'), 1)
    const limit = Math.min(Math.max(parseInt(params.get('limit') || '24'), 1), 100)

    // Bounding box for initial geo filter (approximate)
    const latDelta = radius / 69
    const lngDelta = radius / (69 * Math.cos((lat * Math.PI) / 180))

    // Find dispensaries within bounding box
    const dispensaries = await prisma.dispensary.findMany({
      where: {
        isActive: true,
        latitude: { gte: lat - latDelta, lte: lat + latDelta },
        longitude: { gte: lng - lngDelta, lte: lng + lngDelta },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        latitude: true,
        longitude: true,
        rating: true,
        reviewsCount: true,
        phone: true,
        address: true,
        zipCode: true,
        hasDelivery: true,
        hasStorefront: true,
        hasCurbside: true,
        acceptsCreditCard: true,
        hasATM: true,
        licenseType: true,
        city: { select: { name: true } },
        state: { select: { name: true, abbreviation: true } },
        BusinessHours: true,
      },
    })

    // Filter by exact Haversine distance
    const nearbyDispensaries = dispensaries
      .map((d) => ({
        ...d,
        distance: haversineDistance(lat!, lng!, d.latitude, d.longitude),
      }))
      .filter((d) => d.distance <= radius)

    if (nearbyDispensaries.length === 0) {
      return NextResponse.json({
        products: [],
        meta: { total: 0, page, totalPages: 0, cheapest: null, average: null },
        filters: { categories: [], brands: [], weights: [] },
      })
    }

    const dispensaryIds = nearbyDispensaries.map((d) => d.id)
    const dispensaryMap = new Map(nearbyDispensaries.map((d) => [d.id, d]))

    // Build product query
    const productWhere: Record<string, unknown> = {
      dispensaryId: { in: dispensaryIds },
      isActive: true,
    }

    if (category) productWhere.category = category
    if (brand) productWhere.brand = { contains: brand, mode: 'insensitive' }
    if (weight) productWhere.weight = weight
    if (strainType) productWhere.strainType = strainType
    if (onSale) productWhere.isOnSale = true
    if (maxPrice) productWhere.price = { lte: maxPrice }
    if (q) {
      productWhere.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { strain: { contains: q, mode: 'insensitive' } },
      ]
    }

    // Get total count
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const total = await prisma.menuProduct.count({ where: productWhere as any })

    // Determine sort
    let orderBy: Record<string, string> = { price: 'asc' }
    if (sort === 'price_desc') orderBy = { price: 'desc' }
    else if (sort === 'rating') orderBy = { price: 'asc' } // Will re-sort by dispensary rating below

    // Fetch products
    const products = await prisma.menuProduct.findMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: productWhere as any,
      orderBy,
      skip: (page - 1) * limit,
      take: sort === 'distance' || sort === 'rating' ? limit * 3 : limit, // Overfetch for client-side sort
    })

    // Enrich products with dispensary info and distance
    let enriched = products.map((p) => {
      const dispensary = dispensaryMap.get(p.dispensaryId)

      // Check if dispensary is currently open
      let isOpen = false
      if (dispensary?.BusinessHours) {
        const now = new Date()
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
        const today = days[now.getDay()]
        const todayHours = dispensary.BusinessHours.find((h) => h.dayOfWeek === today)
        if (todayHours && !todayHours.isClosed) {
          const currentTime = now.getHours() * 100 + now.getMinutes()
          const openTime = parseInt(todayHours.openTime.replace(':', ''))
          const closeTime = parseInt(todayHours.closeTime.replace(':', ''))
          isOpen = currentTime >= openTime && currentTime <= closeTime
        }
      }

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        subcategory: p.subcategory,
        price: p.price,
        originalPrice: p.originalPrice,
        weight: p.weight,
        thcContent: p.thcContent,
        cbdContent: p.cbdContent,
        strainType: p.strainType,
        imageUrl: p.imageUrl,
        isOnSale: p.isOnSale,
        lastScrapedAt: p.lastScrapedAt,
        dispensary: {
          name: dispensary?.name || '',
          slug: dispensary?.slug || '',
          distance: Math.round((dispensary?.distance || 0) * 10) / 10,
          rating: dispensary?.rating || 0,
          reviewsCount: dispensary?.reviewsCount || 0,
          city: dispensary?.city?.name || '',
          state: dispensary?.state?.abbreviation || '',
          phone: dispensary?.phone || null,
          address: dispensary?.address || '',
          zipCode: dispensary?.zipCode || '',
          latitude: dispensary?.latitude || 0,
          longitude: dispensary?.longitude || 0,
          hasDelivery: dispensary?.hasDelivery || false,
          hasStorefront: dispensary?.hasStorefront || false,
          hasCurbside: dispensary?.hasCurbside || false,
          acceptsCreditCard: dispensary?.acceptsCreditCard || false,
          hasATM: dispensary?.hasATM || false,
          licenseType: dispensary?.licenseType || 'MEDICAL',
          isOpen,
        },
      }
    })

    // Re-sort for distance and rating modes
    if (sort === 'distance') {
      enriched.sort((a, b) => a.dispensary.distance - b.dispensary.distance)
      enriched = enriched.slice(0, limit)
    } else if (sort === 'rating') {
      enriched.sort((a, b) => (b.dispensary.rating || 0) - (a.dispensary.rating || 0))
      enriched = enriched.slice(0, limit)
    }

    // Calculate stats
    const prices = enriched.map((p) => p.price).filter((p) => p > 0)
    const cheapest = prices.length > 0 ? Math.min(...prices) : null
    const average = prices.length > 0 ? Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100 : null

    // Get available filters
    const [categoryFacets, brandFacets, weightFacets] = await Promise.all([
      prisma.menuProduct.groupBy({
        by: ['category'],
        where: { dispensaryId: { in: dispensaryIds }, isActive: true },
        _count: true,
        orderBy: { _count: { category: 'desc' } },
      }),
      prisma.menuProduct.groupBy({
        by: ['brand'],
        where: { dispensaryId: { in: dispensaryIds }, isActive: true, brand: { not: null } },
        _count: true,
        orderBy: { _count: { brand: 'desc' } },
        take: 20,
      }),
      prisma.menuProduct.groupBy({
        by: ['weight'],
        where: { dispensaryId: { in: dispensaryIds }, isActive: true },
        _count: true,
        orderBy: { _count: { weight: 'desc' } },
      }),
    ])

    return NextResponse.json({
      products: enriched,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        cheapest,
        average,
      },
      filters: {
        categories: categoryFacets.map((c) => ({ name: c.category, count: c._count })),
        brands: brandFacets
          .filter((b) => b.brand)
          .map((b) => ({ name: b.brand!, count: b._count })),
        weights: weightFacets
          .filter((w) => w.weight)
          .map((w) => ({ name: w.weight!, count: w._count })),
      },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
