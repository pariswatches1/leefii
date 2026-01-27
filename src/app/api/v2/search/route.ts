import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEARCH_CONFIG } from '@/lib/search/search-config';
import type {
  SearchResultsResponse,
  SearchResultType,
  SearchSuggestion,
} from '@/components/search-v2/types';

/**
 * GET /api/v2/search
 * Returns paginated search results with facets
 *
 * Query params:
 * - q: search query (required, min 2 chars)
 * - type: result type filter (dispensaries, locations, products, strains, brands, all)
 * - page: page number (default 1)
 * - limit: results per page (default 20, max 50)
 * - lat: user latitude (optional, for location boosting)
 * - lng: user longitude (optional, for location boosting)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const type = (searchParams.get('type') || 'all') as SearchResultType | 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

    // Validate query length
    if (query.length < SEARCH_CONFIG.minQueryLength) {
      return NextResponse.json({
        query,
        type,
        results: [],
        pagination: { page, limit, total: 0, pages: 0 },
        facets: { dispensaries: 0, locations: 0, products: 0, strains: 0, brands: 0 },
      });
    }

    // Get facet counts (always fetch all for the sidebar)
    const facets = await getFacetCounts(query);

    // Get results based on type
    let results: SearchSuggestion[] = [];
    let total = 0;

    switch (type) {
      case 'dispensary':
        ({ results, total } = await searchDispensaries(query, lat, lng, page, limit));
        break;
      case 'location':
        ({ results, total } = await searchLocations(query, page, limit));
        break;
      case 'product':
        ({ results, total } = await searchProducts(query, page, limit));
        break;
      case 'strain':
        ({ results, total } = await searchStrains(query, page, limit));
        break;
      case 'brand':
        ({ results, total } = await searchBrands(query, page, limit));
        break;
      case 'all':
      default:
        ({ results, total } = await searchAll(query, lat, lng, page, limit));
        break;
    }

    // Track analytics for search (async, non-blocking)
    if (SEARCH_CONFIG.analytics.enabled) {
      trackSearch(query, type, total, lat, lng).catch(() => {});
    }

    const response: SearchResultsResponse = {
      query,
      type,
      results,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      facets,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}

/**
 * Get facet counts for all types
 */
async function getFacetCounts(query: string) {
  const [dispensaries, cities, states, products, strains, brands] = await Promise.all([
    prisma.dispensary.count({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { chainName: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),
    prisma.city.count({
      where: { name: { contains: query, mode: 'insensitive' } },
    }),
    prisma.state.count({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { abbreviation: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),
    prisma.product.count({
      where: {
        isAvailable: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
    }),
    prisma.strain.count({
      where: {
        isActive: true,
        name: { contains: query, mode: 'insensitive' },
      },
    }),
    prisma.product.findMany({
      where: {
        isAvailable: true,
        brand: { not: null, contains: query, mode: 'insensitive' },
      },
      select: { brand: true },
      distinct: ['brand'],
    }),
  ]);

  return {
    dispensaries,
    locations: cities + states,
    products,
    strains,
    brands: brands.length,
  };
}

/**
 * Search all types combined
 */
async function searchAll(
  query: string,
  lat: number | null,
  lng: number | null,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  // For "all" search, distribute results across types based on priority
  const dispensaryLimit = Math.ceil(limit * 0.35);
  const locationLimit = Math.ceil(limit * 0.2);
  const productLimit = Math.ceil(limit * 0.2);
  const strainLimit = Math.ceil(limit * 0.15);
  const brandLimit = Math.ceil(limit * 0.1);

  const [
    { results: dispensaries },
    { results: locations },
    { results: products },
    { results: strains },
    { results: brands },
  ] = await Promise.all([
    searchDispensaries(query, lat, lng, 1, dispensaryLimit),
    searchLocations(query, 1, locationLimit),
    searchProducts(query, 1, productLimit),
    searchStrains(query, 1, strainLimit),
    searchBrands(query, 1, brandLimit),
  ]);

  // Interleave results by priority
  const combined = [
    ...dispensaries,
    ...locations,
    ...products,
    ...strains,
    ...brands,
  ];

  // Get total count across all types
  const facets = await getFacetCounts(query);
  const total = facets.dispensaries + facets.locations + facets.products + facets.strains + facets.brands;

  return {
    results: combined.slice(0, limit),
    total,
  };
}

/**
 * Search dispensaries with pagination
 */
async function searchDispensaries(
  query: string,
  lat: number | null,
  lng: number | null,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  const where = {
    isActive: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { chainName: { contains: query, mode: 'insensitive' as const } },
      { address: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [dispensaries, total] = await Promise.all([
    prisma.dispensary.findMany({
      where,
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isPremium: 'desc' }, { rating: 'desc' }],
    }),
    prisma.dispensary.count({ where }),
  ]);

  const results: SearchSuggestion[] = dispensaries.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    type: 'dispensary' as const,
    subtitle: `${d.city.name}, ${d.state.abbreviation}`,
  }));

  return { results, total };
}

/**
 * Search locations with pagination
 */
async function searchLocations(
  query: string,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  const cityWhere = { name: { contains: query, mode: 'insensitive' as const } };
  const stateWhere = {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { abbreviation: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [cities, states, cityCount, stateCount] = await Promise.all([
    prisma.city.findMany({
      where: cityWhere,
      select: {
        id: true,
        name: true,
        slug: true,
        dispensaryCount: true,
        state: { select: { slug: true, abbreviation: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { dispensaryCount: 'desc' },
    }),
    prisma.state.findMany({
      where: stateWhere,
      select: {
        id: true,
        name: true,
        slug: true,
        abbreviation: true,
        _count: { select: { dispensaries: true } },
      },
      take: 5, // States are limited
    }),
    prisma.city.count({ where: cityWhere }),
    prisma.state.count({ where: stateWhere }),
  ]);

  const results: SearchSuggestion[] = [
    ...states.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      type: 'location' as const,
      subtitle: `${s._count.dispensaries} dispensaries`,
    })),
    ...cities.map((c) => ({
      id: c.id,
      name: c.name,
      slug: `${c.state.slug}/${c.slug}`,
      type: 'location' as const,
      subtitle: `${c.state.abbreviation} · ${c.dispensaryCount} dispensaries`,
    })),
  ];

  return { results, total: cityCount + stateCount };
}

/**
 * Search products with pagination
 */
async function searchProducts(
  query: string,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  const where = {
    isAvailable: true,
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { brand: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        brand: true,
        seller: { select: { businessName: true, slug: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { viewCount: 'desc' }],
    }),
    prisma.product.count({ where }),
  ]);

  const results: SearchSuggestion[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: `${p.seller.slug}/${p.slug}`,
    type: 'product' as const,
    subtitle: p.brand ? `${p.brand} · $${p.price}` : `$${p.price}`,
  }));

  return { results, total };
}

/**
 * Search strains with pagination
 */
async function searchStrains(
  query: string,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  const where = {
    isActive: true,
    name: { contains: query, mode: 'insensitive' as const },
  };

  const [strains, total] = await Promise.all([
    prisma.strain.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        thcMax: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    }),
    prisma.strain.count({ where }),
  ]);

  const results: SearchSuggestion[] = strains.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    type: 'strain' as const,
    subtitle: s.thcMax ? `${s.type} · ${s.thcMax}% THC` : s.type,
  }));

  return { results, total };
}

/**
 * Search brands with pagination
 */
async function searchBrands(
  query: string,
  page: number,
  limit: number
): Promise<{ results: SearchSuggestion[]; total: number }> {
  // Get distinct brands
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
      brand: { not: null, contains: query, mode: 'insensitive' },
    },
    select: { brand: true },
    distinct: ['brand'],
  });

  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean) as string[]));
  const total = uniqueBrands.length;

  // Paginate
  const paginatedBrands = uniqueBrands.slice((page - 1) * limit, page * limit);

  // Get product counts
  const brandCounts = await prisma.product.groupBy({
    by: ['brand'],
    where: {
      isAvailable: true,
      brand: { in: paginatedBrands },
    },
    _count: { id: true },
  });

  const countMap = new Map(brandCounts.map((b) => [b.brand, b._count.id]));

  const results: SearchSuggestion[] = paginatedBrands.map((brand, index) => ({
    id: `brand-${(page - 1) * limit + index}`,
    name: brand,
    slug: brand.toLowerCase().replace(/\s+/g, '-'),
    type: 'brand' as const,
    subtitle: `${countMap.get(brand) || 0} products`,
  }));

  return { results, total };
}

/**
 * Track search analytics
 */
async function trackSearch(
  query: string,
  type: SearchResultType | 'all',
  totalResults: number,
  lat: number | null,
  lng: number | null
) {
  try {
    // Track zero results
    if (totalResults === 0 && SEARCH_CONFIG.analytics.trackZeroResults) {
      await prisma.analyticsEvent.create({
        data: {
          eventType: 'PAGE_VIEW',
          page: `/search?q=${encodeURIComponent(query)}&type=${type}`,
          city: lat && lng ? 'search_zero_results' : undefined,
        },
      });
    }

    // Track popular searches (simplified - just increment a counter)
    if (SEARCH_CONFIG.analytics.trackPopularSearches) {
      await prisma.pageView.upsert({
        where: {
          path_date: {
            path: `search:${query.toLowerCase().trim()}`,
            date: new Date(new Date().toISOString().split('T')[0]),
          },
        },
        update: { viewCount: { increment: 1 } },
        create: {
          path: `search:${query.toLowerCase().trim()}`,
          date: new Date(new Date().toISOString().split('T')[0]),
          viewCount: 1,
        },
      });
    }
  } catch {
    // Silently fail - analytics should never break search
  }
}
