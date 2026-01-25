import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseInt(searchParams.get('radius') || '50000'); // Default 50km

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    // Search for medical marijuana doctors/clinics
    const searchQuery = 'medical marijuana card doctor';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(searchQuery)}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { error: 'Failed to fetch doctors', details: data.status },
        { status: 500 }
      );
    }

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

    const doctors = (data.results || []).map((place: {
      place_id: string;
      name: string;
      vicinity: string;
      geometry: { location: { lat: number; lng: number } };
      rating?: number;
      user_ratings_total?: number;
      opening_hours?: { open_now: boolean };
      photos?: { photo_reference: string }[];
      business_status?: string;
    }) => {
      const distance = calculateDistance(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        rating: place.rating || 0,
        reviewsCount: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now ?? null,
        photoRef: place.photos?.[0]?.photo_reference || null,
        distance: Math.round(distance * 10) / 10,
        status: place.business_status || 'OPERATIONAL',
      };
    }).sort((a: { distance: number }, b: { distance: number }) => a.distance - b.distance);

    return NextResponse.json({
      doctors,
      total: doctors.length,
    });
  } catch (error) {
    console.error('Nearby doctors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby doctors' },
      { status: 500 }
    );
  }
}
