'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from '@/components/LocationDetector'
import ProductCard, { type ProductData } from '@/components/shop/ProductCard'
import LocationInput from '@/components/shop/LocationInput'

interface Meta {
  total: number
  page: number
  totalPages: number
  cheapest: number | null
  average: number | null
}

interface Filters {
  categories: { name: string; count: number }[]
  brands: { name: string; count: number }[]
  weights: { name: string; count: number }[]
}

interface ApiResponse {
  products: ProductData[]
  meta: Meta
  filters: Filters
  error?: string
}

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'distance', label: 'Distance: Nearest' },
  { value: 'rating', label: 'Rating: Best' },
]

const CATEGORY_EMOJIS: Record<string, string> = {
  flower: '🌿',
  edibles: '🍪',
  vapes: '💨',
  concentrates: '💎',
  'pre-rolls': '🚬',
  tinctures: '💧',
  topicals: '🧴',
}

export default function ShopClient() {
  const { location } = useLocation()

  // Location state
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState(25)

  // Filter state
  const [category, setCategory] = useState<string | null>(null)
  const [sort, setSort] = useState('price_asc')
  const [onSale, setOnSale] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Data state
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [allProducts, setAllProducts] = useState<ProductData[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  // Refs
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFetchParams = useRef<string>('')

  // Build URL params for API call
  const buildParams = useCallback(
    (overrides: { page?: number; lat?: number; lng?: number; zipCode?: string } = {}) => {
      const params = new URLSearchParams()

      // Location
      if (overrides.lat && overrides.lng) {
        params.set('lat', overrides.lat.toString())
        params.set('lng', overrides.lng.toString())
      } else if (overrides.zipCode || zip) {
        params.set('zip', overrides.zipCode || zip)
      } else if (location?.lat && location?.lng) {
        params.set('lat', location.lat.toString())
        params.set('lng', location.lng.toString())
      } else {
        return null // No location available
      }

      params.set('radius', radius.toString())
      if (category) params.set('category', category)
      params.set('sort', sort)
      if (onSale) params.set('onSale', 'true')
      if (searchQuery.trim()) params.set('q', searchQuery.trim())

      const p = overrides.page || page
      params.set('page', p.toString())
      params.set('limit', '24')

      return params
    },
    [zip, radius, category, sort, onSale, searchQuery, page, location]
  )

  // Fetch products from API
  const fetchProducts = useCallback(
    async (overrides: { page?: number; lat?: number; lng?: number; zipCode?: string } = {}) => {
      const params = buildParams(overrides)
      if (!params) return

      const paramsString = params.toString()
      // Prevent duplicate fetches
      if (paramsString === lastFetchParams.current && !overrides.page) return
      lastFetchParams.current = paramsString

      setLoading(true)
      setHasSearched(true)

      try {
        const res = await fetch(`/api/v2/products?${paramsString}`)
        const json: ApiResponse = await res.json()

        if (json.error) {
          console.error('API error:', json.error)
          setLoading(false)
          return
        }

        setData(json)

        const currentPage = overrides.page || page
        if (currentPage === 1) {
          setAllProducts(json.products)
        } else {
          setAllProducts((prev) => [...prev, ...json.products])
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    },
    [buildParams, page]
  )

  // Auto-detect location and fetch
  useEffect(() => {
    if (location && !hasSearched && !zip) {
      if (location.zip) {
        setZip(location.zip)
      }
      fetchProducts({ lat: location.lat, lng: location.lng })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  // When filters change, reset and refetch
  useEffect(() => {
    if (!hasSearched) return
    setPage(1)
    lastFetchParams.current = '' // Force refetch
    fetchProducts({ page: 1 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, onSale, radius])

  // Debounced search
  useEffect(() => {
    if (!hasSearched) return
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setPage(1)
      lastFetchParams.current = ''
      fetchProducts({ page: 1 })
    }, 400)
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Handle ZIP search
  const handleSearch = (zipCode: string) => {
    setPage(1)
    setAllProducts([])
    lastFetchParams.current = ''
    fetchProducts({ page: 1, zipCode })
  }

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts({ page: nextPage })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Location Input */}
      <LocationInput
        zip={zip}
        setZip={setZip}
        radius={radius}
        setRadius={setRadius}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Stats Bar */}
      {data && data.meta.total > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold text-gray-900">
              {data.meta.total.toLocaleString()} products found
            </span>
            {data.meta.cheapest !== null && (
              <span className="text-green-600 font-medium">
                Cheapest: ${data.meta.cheapest.toFixed(2)}
              </span>
            )}
            {data.meta.average !== null && (
              <span className="text-gray-600">
                Avg: ${data.meta.average.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      {data && (
        <div className="mb-6 space-y-4">
          {/* Search input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, strains..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category pills */}
            <button
              onClick={() => setCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                category === null
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {data.filters.categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name === category ? null : cat.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  category === cat.name
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_EMOJIS[cat.name] || '🌱'} {cat.name}{' '}
                <span className="opacity-70">({cat.count})</span>
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-full text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* On Sale toggle */}
            <button
              onClick={() => setOnSale(!onSale)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                onSale
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 On Sale
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {allProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && allProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-green-600 mb-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-gray-600">Finding the best deals near you...</p>
        </div>
      )}

      {/* Empty state - no location */}
      {!hasSearched && !loading && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Enter your ZIP code to find deals nearby
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            We&apos;ll show you the cheapest cannabis products from dispensaries in your area,
            sorted by price so you always get the best deal.
          </p>
        </div>
      )}

      {/* Empty state - no results */}
      {hasSearched && !loading && allProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Try expanding your search radius, clearing filters, or searching a different ZIP code.
            Product data is being added daily.
          </p>
        </div>
      )}

      {/* Load More button */}
      {data && page < data.meta.totalPages && allProducts.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </>
            ) : (
              `Load More (${data.meta.total - allProducts.length} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  )
}
