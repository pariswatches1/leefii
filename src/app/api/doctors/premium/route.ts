import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Calculate distance using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const state = searchParams.get('state') || '';

    // Fetch all active premium doctors
    // Filter by state if provided, otherwise fetch all
    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
        subscriptionStatus: 'ACTIVE',
        subscriptionTier: {
          in: ['BASIC', 'PREMIUM'],
        },
        ...(state ? { state: { contains: state, mode: 'insensitive' as const } } : {}),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { subscriptionTier: 'desc' },
        { rating: 'desc' },
      ],
    });

    // Calculate distance and format response
    const formattedDoctors = doctors.map((doctor) => {
      let distance = 0;
      if (!isNaN(lat) && !isNaN(lng) && doctor.latitude && doctor.longitude) {
        distance = calculateDistance(lat, lng, doctor.latitude, doctor.longitude);
      }

      return {
        id: doctor.id,
        name: doctor.name,
        businessName: doctor.businessName,
        address: [doctor.address, doctor.city, doctor.state, doctor.zipCode]
          .filter(Boolean)
          .join(', '),
        lat: doctor.latitude || 0,
        lng: doctor.longitude || 0,
        rating: doctor.rating || 0,
        reviewsCount: doctor.reviewsCount || 0,
        isOpen: null, // Could be calculated from business hours
        distance: Math.round(distance * 10) / 10,
        // Premium fields
        isPremium: true,
        isFeatured: doctor.isFeatured,
        tier: doctor.subscriptionTier,
        phone: doctor.phone,
        website: doctor.website,
        services: doctor.services,
        telemedicine: doctor.telemedicine,
        logo: doctor.logo,
        slug: doctor.slug,
      };
    });

    // Sort by distance if coordinates provided
    if (!isNaN(lat) && !isNaN(lng)) {
      formattedDoctors.sort((a, b) => {
        // Featured first, then by distance
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.distance - b.distance;
      });
    }

    return NextResponse.json({
      doctors: formattedDoctors,
      total: formattedDoctors.length,
    });
  } catch (error) {
    console.error('Premium doctors fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch premium doctors', doctors: [] },
      { status: 500 }
    );
  }
}
