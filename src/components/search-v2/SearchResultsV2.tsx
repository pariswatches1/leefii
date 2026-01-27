'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Package,
  Cannabis,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalSearchV2 } from './GlobalSearchV2';
import type { SearchResultsResponse, SearchResultType, SearchSuggestion } from './types';

interface SearchResultsV2Props {
  initialQuery?: string;
  initialType?: SearchResultType | 'all';
}

const TABS = [
  { id: 'all' as const, label: 'All', icon: Search },
  { id: 'dispensary' as const, label: 'Dispensaries', icon: Building2 },
  { id: 'location' as const, label: 'Locations', icon: MapPin },
  { id: 'product' as const, label: 'Products', icon: Package },
  { id: 'strain' as const, label: 'Strains', icon: Cannabis },
  { id: 'brand' as const, label: 'Brands', icon: Tag },
];

/**
 * Full search results page with tabs, facets, and pagination
 */
export function SearchResultsV2({ initialQuery = '', initialType = 'all' }: SearchResultsV2Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '');
  const [type, setType] = useState<SearchResultType | 'all'>(
    (searchParams.get('type') as SearchResultType | 'all') || initialType
  );
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [data, setData] = useState<SearchResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch results when query/type/page changes
  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: query,
          type,
          page: page.toString(),
          limit: '20',
        });

        const response = await fetch(`/api/v2/search?${params}`);
        if (!response.ok) throw new Error('Search failed');

        const result: SearchResultsResponse = await response.json();
        setData(result);
      } catch (err) {
        setError('Failed to load search results. Please try again.');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, type, page]);

  // Update URL when search params change
  useEffect(() => {
    if (query) {
      const params = new URLSearchParams();
      params.set('q', query);
      if (type !== 'all') params.set('type', type);
      if (page > 1) params.set('page', page.toString());
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }
  }, [query, type, page, router]);

  const handleTabChange = (newType: SearchResultType | 'all') => {
    setType(newType);
    setPage(1);
  };

  const handleSearchSubmit = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <GlobalSearchV2
            initialQuery={query}
            onSubmit={handleSearchSubmit}
            placeholder="Search dispensaries, strains, products..."
          />
        </div>

        {/* Tabs */}
        {query && (
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const count = data?.facets[tab.id === 'all' ? 'dispensaries' : tab.id as keyof typeof data.facets];
                const isActive = type === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                      isActive
                        ? 'text-green-600 border-green-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.id !== 'all' && count !== undefined && count > 0 && (
                      <span
                        className={cn(
                          'px-1.5 py-0.5 text-xs rounded-full',
                          isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="mt-4 text-green-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty query state */}
        {!query && !isLoading && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Search Leefii
            </h2>
            <p className="text-gray-500">
              Find dispensaries, strains, products, and more
            </p>
          </div>
        )}

        {/* No results state */}
        {query && data && data.results.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No results for "{query}"
            </h2>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or browse our categories
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/dispensaries"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200"
              >
                Browse Dispensaries
              </Link>
              <Link
                href="/strains"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200"
              >
                Explore Strains
              </Link>
              <Link
                href="/marketplace"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200"
              >
                Shop Marketplace
              </Link>
            </div>
          </div>
        )}

        {/* Results list */}
        {data && data.results.length > 0 && !isLoading && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.pagination.total.toLocaleString()} results for "{query}"
            </p>

            <div className="space-y-3">
              {data.results.map((result) => (
                <ResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    page === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, data.pagination.pages) }, (_, i) => {
                    let pageNum: number;
                    if (data.pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= data.pagination.pages - 2) {
                      pageNum = data.pagination.pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                          pageNum === page
                            ? 'bg-green-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                  disabled={page === data.pagination.pages}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    page === data.pagination.pages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Individual result card
 */
function ResultCard({ result }: { result: SearchSuggestion }) {
  const icons = {
    dispensary: Building2,
    location: MapPin,
    product: Package,
    strain: Cannabis,
    brand: Tag,
  };

  const colors = {
    dispensary: 'bg-green-100 text-green-600',
    location: 'bg-blue-100 text-blue-600',
    product: 'bg-purple-100 text-purple-600',
    strain: 'bg-emerald-100 text-emerald-600',
    brand: 'bg-orange-100 text-orange-600',
  };

  const links = {
    dispensary: `/dispensaries/${result.slug}`,
    location: `/dispensaries/${result.slug}`,
    product: `/marketplace/products/${result.slug}`,
    strain: `/strains/${result.slug}`,
    brand: `/marketplace?brand=${result.slug}`,
  };

  const Icon = icons[result.type];

  return (
    <Link
      href={links[result.type]}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-green-300 transition-all"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            colors[result.type]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-gray-900 truncate">{result.name}</h3>
          {result.subtitle && (
            <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
          )}
        </div>
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded-full capitalize flex-shrink-0',
            colors[result.type]
          )}
        >
          {result.type}
        </span>
      </div>
    </Link>
  );
}
