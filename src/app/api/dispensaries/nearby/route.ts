import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseFloat(searchParams.get('radius') || '50'); // Default 50 miles
    const limit = parseInt(searchParams.get('limit') || '6');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Get all dispensaries with coordinates
    const dispensaries = await prisma.dispensary.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        address: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        rating: true,
        reviewsCount: true,
        imageUrl: true,
        hasDelivery: true,
        hasStorefront: true,
        hasCurbside: true,
        city: {
          select: { name: true },
        },
        state: {
          select: { abbreviation: true },
        },
      },
    });

    // Calculate distances and filter by radius
    const nearbyDispensaries = dispensaries
      .map((dispensary) => {
        const distance = calculateDistance(
          lat,
          lng,
          dispensary.latitude!,
          dispensary.longitude!
        );
        return { ...dispensary, distance };
      })
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);

    return NextResponse.json({
      dispensaries: nearbyDispensaries.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        address: d.address,
        city: d.city.name,
        state: d.state.abbreviation,
        rating: d.rating || 0,
        reviewsCount: d.reviewsCount,
        imageUrl: d.imageUrl,
        hasDelivery: d.hasDelivery,
        hasStorefront: d.hasStorefront,
        distance: Math.round(d.distance * 10) / 10, // Round to 1 decimal
      })),
      total: nearbyDispensaries.length,
    });
  } catch (error) {
    console.error('Nearby dispensaries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby dispensaries' },
      { status: 500 }
    );
  }
}
