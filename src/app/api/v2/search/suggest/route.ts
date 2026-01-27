import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { SEARCH_CONFIG } from '@/lib/search/search-config';
import type {
  DispensarySuggestion,
  LocationSuggestion,
  ProductSuggestion,
  StrainSuggestion,
  BrandSuggestion,
  SearchSuggestionsResponse,
} from '@/components/search-v2/types';

// Intent detection patterns - recognizes when user wants nearby results
const INTENT_PATTERNS = {
  dispensaries: ['dispensary', 'dispensaries', 'shop', 'shops', 'store', 'stores', 'near me', 'nearby'],
  doctors: ['doctor', 'doctors', 'physician', 'clinic', 'medical card', 'mmj card'],
  strains: ['strain', 'strains'],
  deals: ['deal', 'deals', 'discount', 'sale'],
};

type IntentType = keyof typeof INTENT_PATTERNS | null;

/**
 * Detect user intent from query
 */
function detectIntent(query: string): IntentType {
  const normalizedQuery = query.toLowerCase().trim();

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (normalizedQuery === pattern || normalizedQuery.includes(pattern)) {
        return intent as IntentType;
      }
    }
  }

  return null;
}

// Default location for development (Miami, FL)
const DEV_DEFAULT_LOCATION = { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'Florida' };

/**
 * Get user location from IP address
 */
async function getLocationFromIP(): Promise<{ lat: number; lng: number; city: string; state: string } | null> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || '';

    // On localhost/development, IP lookup won't work - use default
    const isLocalhost = !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.');

    // Try ipapi.co first
    try {
      const response = await fetch(
        ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/',
        {
          next: { revalidate: 3600 },
          headers: { 'User-Agent': 'Leefii/1.0' }
        }
      );
      const data = await response.json();

      if (!data.error && data.city && data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          state: data.region || '',
        };
      }
    } catch {
      // Continue to fallback
    }

    // Fallback to ip-api.com
    try {
      const fallbackUrl = ip
        ? `http://ip-api.com/json/${ip}?fields=city,regionName,lat,lon`
        : 'http://ip-api.com/json/?fields=city,regionName,lat,lon';

      const response = await fetch(fallbackUrl);
      const data = await response.json();

      if (data.city && data.lat && data.lon) {
        return {
          lat: data.lat,
          lng: data.lon,
          city: data.city,
          state: data.regionName || '',
        };
      }
    } catch {
      // Both failed
    }

    // Fallback to default location for development
    if (isLocalhost || process.env.NODE_ENV === 'development') {
      return DEV_DEFAULT_LOCATION;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * GET /api/v2/search/suggest
 * Returns autocomplete suggestions grouped by type
 *
 * Smart behavior:
 * - Detects intent queries like "dispensaries" and returns nearby results
 * - Uses IP-based geolocation when lat/lng not provided
 * - Falls back to text search for specific queries
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    let lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    let lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

    // Validate query length
    if (query.length < SEARCH_CONFIG.minQueryLength) {
      return NextResponse.json({
        query,
        suggestions: {
          dispensaries: [],
          locations: [],
          products: [],
          strains: [],
          brands: [],
        },
      });
    }

    // Detect intent from query
    const intent = detectIntent(query);

    // Get location from IP if not provided and we have an intent that needs it
    let locationInfo: { city: string; state: string } | null = null;
    if (!lat || !lng) {
      if (intent === 'dispensaries' || intent === 'doctors') {
        const ipLocation = await getLocationFromIP();
        if (ipLocation) {
          lat = ipLocation.lat;
          lng = ipLocation.lng;
          locationInfo = { city: ipLocation.city, state: ipLocation.state };
        }
      }
    }

    // Handle intent-based queries differently
    if (intent === 'dispensaries') {
      if (lat && lng) {
        // User wants nearby dispensaries - return location-based results
        const dispensaries = await getNearbyDispensaries(lat, lng, 10);

        return NextResponse.json({
          query,
          intent: 'dispensaries',
          suggestions: {
            dispensaries,
            locations: [],
            products: [],
            strains: [],
            brands: [],
          },
          location: locationInfo ? { lat, lng, ...locationInfo } : { lat, lng },
        });
      } else {
        // No location available - return popular/featured dispensaries
        const dispensaries = await getPopularDispensaries(10);

        return NextResponse.json({
          query,
          intent: 'dispensaries',
          suggestions: {
            dispensaries,
            locations: [],
            products: [],
            strains: [],
            brands: [],
          },
          message: 'Showing popular dispensaries. Enable location for nearby results.',
        });
      }
    }

    // Standard search - run all searches in parallel
    const [dispensaries, cities, states, products, strains, brands] = await Promise.all([
      searchDispensaries(query, lat, lng, SEARCH_CONFIG.suggestionsLimit.dispensaries),
      searchCities(query, SEARCH_CONFIG.suggestionsLimit.locations),
      searchStates(query, 2),
      searchProducts(query, SEARCH_CONFIG.suggestionsLimit.products),
      searchStrains(query, SEARCH_CONFIG.suggestionsLimit.strains),
      searchBrands(query, SEARCH_CONFIG.suggestionsLimit.brands),
    ]);

    // Combine cities and states into locations
    const locations: LocationSuggestion[] = [
      ...cities,
      ...states,
    ].slice(0, SEARCH_CONFIG.suggestionsLimit.locations);

    const response: SearchSuggestionsResponse = {
      query,
      suggestions: {
        dispensaries,
        locations,
        products,
        strains,
        brands,
      },
      ...(lat && lng ? { location: { lat, lng } } : {}),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search suggest error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}

/**
 * Get popular/featured dispensaries (fallback when no location)
 */
async function getPopularDispensaries(limit: number): Promise<DispensarySuggestion[]> {
  const dispensaries = await prisma.dispensary.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      city: { select: { name: true } },
      state: { select: { abbreviation: true } },
    },
    take: limit,
    orderBy: [
      { isPremium: 'desc' },
      { rating: 'desc' },
      { reviewsCount: 'desc' },
    ],
  });

  return dispensaries.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    type: 'dispensary' as const,
    city: d.city.name,
    state: d.state.abbreviation,
    address: d.address,
    subtitle: 'Popular dispensary',
  }));
}

/**
 * Get nearby dispensaries by location (for intent queries)
 */
async function getNearbyDispensaries(
  lat: number,
  lng: number,
  limit: number
): Promise<DispensarySuggestion[]> {
  // Get dispensaries within ~50 miles, sorted by distance
  const dispensaries = await prisma.dispensary.findMany({
    where: {
      isActive: true,
      latitude: { gte: lat - 0.75, lte: lat + 0.75 }, // ~50 miles lat
      longitude: { gte: lng - 0.75, lte: lng + 0.75 }, // ~50 miles lng
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      latitude: true,
      longitude: true,
      rating: true,
      city: { select: { name: true } },
      state: { select: { abbreviation: true } },
    },
    take: 50, // Fetch extra for distance sorting
    orderBy: [
      { isPremium: 'desc' },
      { rating: 'desc' },
    ],
  });

  // Sort by distance and take top results
  const sorted = dispensaries
    .map((d) => ({
      ...d,
      distance: calculateDistance(lat, lng, d.latitude, d.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);

  return sorted.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    type: 'dispensary' as const,
    city: d.city.name,
    state: d.state.abbreviation,
    address: d.address,
    subtitle: `${d.distance.toFixed(1)} mi away`,
  }));
}

/**
 * Search dispensaries with optional location boosting
 */
async function searchDispensaries(
  query: string,
  lat: number | null,
  lng: number | null,
  limit: number
): Promise<DispensarySuggestion[]> {
  const dispensaries = await prisma.dispensary.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { chainName: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      latitude: true,
      longitude: true,
      city: { select: { name: true } },
      state: { select: { abbreviation: true } },
    },
    take: limit * 2,
    orderBy: [
      { isPremium: 'desc' },
      { rating: 'desc' },
    ],
  });

  let results = dispensaries;
  if (lat && lng) {
    results = dispensaries
      .map((d) => ({
        ...d,
        distance: calculateDistance(lat, lng, d.latitude, d.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  } else {
    results = dispensaries.slice(0, limit);
  }

  return results.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    type: 'dispensary' as const,
    city: d.city.name,
    state: d.state.abbreviation,
    address: d.address,
  }));
}

/**
 * Search cities
 */
async function searchCities(query: string, limit: number): Promise<LocationSuggestion[]> {
  const cities = await prisma.city.findMany({
    where: {
      name: { contains: query, mode: 'insensitive' },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      dispensaryCount: true,
      state: { select: { slug: true, abbreviation: true } },
    },
    take: limit,
    orderBy: { dispensaryCount: 'desc' },
  });

  return cities.map((c) => ({
    id: c.id,
    name: c.name,
    slug: `${c.state.slug}/${c.slug}`,
    type: 'location' as const,
    locationType: 'city' as const,
    stateCode: c.state.abbreviation,
    dispensaryCount: c.dispensaryCount,
  }));
}

/**
 * Search states
 */
async function searchStates(query: string, limit: number): Promise<LocationSuggestion[]> {
  const states = await prisma.state.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { abbreviation: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      abbreviation: true,
      _count: { select: { dispensaries: true } },
    },
    take: limit,
    orderBy: { dispensaries: { _count: 'desc' } },
  });

  return states.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    type: 'location' as const,
    locationType: 'state' as const,
    stateCode: s.abbreviation,
    dispensaryCount: s._count.dispensaries,
  }));
}

/**
 * Search products
 */
async function searchProducts(query: string, limit: number): Promise<ProductSuggestion[]> {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      brand: true,
      seller: { select: { businessName: true, slug: true } },
    },
    take: limit,
    orderBy: [
      { isFeatured: 'desc' },
      { viewCount: 'desc' },
    ],
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: `${p.seller.slug}/${p.slug}`,
    type: 'product' as const,
    price: Number(p.price),
    brand: p.brand || undefined,
    sellerName: p.seller.businessName,
  }));
}

/**
 * Search strains
 */
async function searchStrains(query: string, limit: number): Promise<StrainSuggestion[]> {
  const strains = await prisma.strain.findMany({
    where: {
      isActive: true,
      name: { contains: query, mode: 'insensitive' },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      thcMax: true,
    },
    take: limit,
    orderBy: [
      { rating: 'desc' },
      { reviewsCount: 'desc' },
    ],
  });

  return strains.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    type: 'strain' as const,
    strainType: s.type,
    thcMax: s.thcMax || undefined,
  }));
}

/**
 * Search brands
 */
async function searchBrands(query: string, limit: number): Promise<BrandSuggestion[]> {
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      brand: {
        not: null,
        contains: query,
        mode: 'insensitive',
      },
    },
    select: {
      brand: true,
    },
    distinct: ['brand'],
    take: limit * 3,
  });

  const brandCounts = await prisma.product.groupBy({
    by: ['brand'],
    where: {
      isAvailable: true,
      brand: {
        in: products.map((p) => p.brand).filter(Boolean) as string[],
      },
    },
    _count: { id: true },
  });

  const countMap = new Map(brandCounts.map((b) => [b.brand, b._count.id]));
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean) as string[]));

  return uniqueBrands.slice(0, limit).map((brand, index) => ({
    id: `brand-${index}`,
    name: brand,
    slug: brand.toLowerCase().replace(/\s+/g, '-'),
    type: 'brand' as const,
    productCount: countMap.get(brand) || 0,
  }));
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
