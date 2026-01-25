import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Get visitor's IP from headers
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || '';

    // Use ipapi.co which supports HTTPS and has good accuracy
    // Falls back to ip-api.com via server-side (no mixed content issues)
    let locationData = null;

    // Try ipapi.co first (HTTPS, free tier allows 1000 requests/day)
    try {
      const response = await fetch(
        ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/',
        {
          next: { revalidate: 3600 },
          headers: {
            'User-Agent': 'Leefii/1.0'
          }
        }
      );
      const data = await response.json();

      // Check for rate limit or error responses
      if (!data.error && data.city && data.latitude && data.longitude) {
        locationData = {
          city: data.city,
          state: data.region || '',
          zip: data.postal || '',
          lat: data.latitude,
          lng: data.longitude,
          country: data.country_name || '',
        };
      }
    } catch {
      // ipapi.co failed, try fallback
    }

    // Fallback to ip-api.com (server-side, no HTTPS issues)
    if (!locationData) {
      try {
        const fallbackUrl = ip
          ? `http://ip-api.com/json/${ip}?fields=city,regionName,zip,lat,lon`
          : 'http://ip-api.com/json/?fields=city,regionName,zip,lat,lon';

        const response = await fetch(fallbackUrl);
        const data = await response.json();

        if (data.city && data.lat && data.lon) {
          locationData = {
            city: data.city,
            state: data.regionName || '',
            zip: data.zip || '',
            lat: data.lat,
            lng: data.lon,
          };
        }
      } catch {
        // Both services failed
      }
    }

    if (locationData) {
      return NextResponse.json(locationData);
    }

    return NextResponse.json(
      { error: 'Could not detect location' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Geolocation error:', error);
    return NextResponse.json(
      { error: 'Failed to detect location' },
      { status: 500 }
    );
  }
}
