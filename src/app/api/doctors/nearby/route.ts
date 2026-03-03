import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let lat = parseFloat(searchParams.get('lat') || '')
    let lng = parseFloat(searchParams.get('lng') || '')
    const radius = parseFloat(searchParams.get('radius') || '50') // Default 50 miles
    const limit = parseInt(searchParams.get('limit') || '12')

    // Read all headers once
    const headersList = await headers()
    const detectedCity = headersList.get('x-vercel-ip-city')
    const detectedRegion = headersList.get('x-vercel-ip-country-region')

    // If no lat/lng provided, try Vercel geo headers
    if (isNaN(lat) || isNaN(lng)) {
      const vercelLat = headersList.get('x-vercel-ip-latitude')
      const vercelLng = headersList.get('x-vercel-ip-longitude')

      if (vercelLat && vercelLng) {
        lat = parseFloat(vercelLat)
        lng = parseFloat(vercelLng)
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Location not available. Provide lat/lng params or access via Vercel deployment.' },
        { status: 400 }
      )
    }

    // Look up state record to get proper slug and full name
    let stateSlug: string | null = null
    let stateName: string | null = null
    if (detectedRegion) {
      const stateRecord = await prisma.state.findFirst({
        where: { abbreviation: detectedRegion },
        select: { slug: true, name: true },
      })
      if (stateRecord) {
        stateSlug = stateRecord.slug
        stateName = stateRecord.name
      }
    }

    // Query all active doctors with coordinates
    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        businessName: true,
        city: true,
        state: true,
        rating: true,
        reviewsCount: true,
        telemedicine: true,
        isFeatured: true,
        services: true,
        specialties: true,
        phone: true,
        logo: true,
        latitude: true,
        longitude: true,
      },
    })

    // Calculate distances and filter by radius
    const nearbyDoctors = doctors
      .map((doctor) => {
        const distance = calculateDistance(lat, lng, doctor.latitude!, doctor.longitude!)
        return { ...doctor, distance }
      })
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit)

    return NextResponse.json({
      doctors: nearbyDoctors.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        businessName: d.businessName,
        city: d.city,
        state: d.state,
        rating: d.rating || 0,
        reviewsCount: d.reviewsCount || 0,
        telemedicine: d.telemedicine,
        isFeatured: d.isFeatured,
        services: d.services,
        specialties: d.specialties,
        phone: d.phone,
        logo: d.logo,
        distance: Math.round(d.distance * 10) / 10,
      })),
      total: nearbyDoctors.length,
      location: {
        lat,
        lng,
        city: detectedCity ? decodeURIComponent(detectedCity) : null,
        state: detectedRegion || null,
        stateName: stateName || null,
        stateSlug: stateSlug || null,
      },
    })
  } catch (error) {
    console.error('Nearby doctors error:', error)
    return NextResponse.json({ error: 'Failed to fetch nearby doctors' }, { status: 500 })
  }
}
