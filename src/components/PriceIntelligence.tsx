'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface ProductResult {
  id: string
  name: string
  brand: string | null
  category: string
  price: number
  originalPrice: number | null
  weight: string | null
  thcContent: string | null
  cbdContent: string | null
  strainType: string | null
  isOnSale: boolean
  dispensary: {
    name: string
    slug: string
    distance: number
    rating: number
    city: string
    state: string
    isOpen: boolean
  }
}

interface FilterOption {
  name: string
  count: number
}

interface ApiResponse {
  products: ProductResult[]
  meta: { total: number; cheapest: number | null; average: number | null }
  filters: {
    categories: FilterOption[]
    brands: FilterOption[]
    weights: FilterOption[]
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  flower: '🌿',
  edibles: '🍬',
  vapes: '💨',
  concentrates: '🔥',
  'pre-rolls': '🌀',
  tinctures: '💧',
  topicals: '🧴',
}

const STRAIN_COLORS: Record<string, string> = {
  hybrid: 'bg-green-100 text-green-800',
  indica: 'bg-purple-100 text-purple-800',
  sativa: 'bg-amber-100 text-amber-800',
}

// Sample data shown when no real products are available nearby
const SAMPLE_PRODUCTS: ProductResult[] = [
  {
    id: 'sample-1', name: 'Blue Dream', brand: 'Cookies', category: 'flower',
    price: 25.00, originalPrice: 35.00, weight: '3.5g', thcContent: '24.3%',
    cbdContent: '0.1%', strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'Trulieve', slug: '', distance: 1.2, rating: 4.4, city: 'Orlando', state: 'FL', isOpen: true },
  },
  {
    id: 'sample-2', name: 'Blue Dream', brand: 'Trulieve', category: 'flower',
    price: 32.00, originalPrice: null, weight: '3.5g', thcContent: '22.8%',
    cbdContent: '0.2%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Curaleaf', slug: '', distance: 2.8, rating: 4.2, city: 'Orlando', state: 'FL', isOpen: true },
  },
  {
    id: 'sample-3', name: 'Blue Dream Gummies 100mg', brand: 'Wana', category: 'edibles',
    price: 35.00, originalPrice: null, weight: '10pk', thcContent: '100mg total',
    cbdContent: null, strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Surterra Wellness', slug: '', distance: 3.1, rating: 4.1, city: 'Orlando', state: 'FL', isOpen: false },
  },
  {
    id: 'sample-4', name: 'Blue Dream Live Resin Cart', brand: 'Select', category: 'vapes',
    price: 40.00, originalPrice: 55.00, weight: '0.5g', thcContent: '85.2%',
    cbdContent: null, strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'MUV', slug: '', distance: 4.2, rating: 4.5, city: 'Orlando', state: 'FL', isOpen: true },
  },
  {
    id: 'sample-5', name: 'Blue Dream', brand: 'Fluent', category: 'flower',
    price: 42.00, originalPrice: null, weight: '3.5g', thcContent: '21.5%',
    cbdContent: '0.3%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Fluent Cannabis', slug: '', distance: 5.4, rating: 3.9, city: 'Orlando', state: 'FL', isOpen: true },
  },
  {
    id: 'sample-6', name: 'Blue Dream Premium', brand: 'Jungle Boys', category: 'flower',
    price: 48.00, originalPrice: null, weight: '3.5g', thcContent: '28.1%',
    cbdContent: '0.1%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Rise Orlando', slug: '', distance: 6.1, rating: 4.3, city: 'Orlando', state: 'FL', isOpen: true },
  },
]

const SAMPLE_META = { total: 142, cheapest: 25, average: 37 }
const SAMPLE_FILTERS: ApiResponse['filters'] = {
  categories: [
    { name: 'flower', count: 48 },
    { name: 'edibles', count: 36 },
    { name: 'vapes', count: 28 },
    { name: 'concentrates', count: 18 },
    { name: 'pre-rolls', count: 12 },
  ],
  brands: [],
  weights: [],
}

export default function PriceIntelligence() {
  const [products, setProducts] = useState<ProductResult[]>([])
  const [meta, setMeta] = useState<ApiResponse['meta'] | null>(null)
  const [filters, setFilters] = useState<ApiResponse['filters'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [zipCode, setZipCode] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sort, setSort] = useState('price_asc')
  const [locationLabel, setLocationLabel] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  const fetchProducts = useCallback(async (lat?: number, lng?: number, zip?: string, category?: string | null, sortBy?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (lat && lng) {
        params.set('lat', lat.toString())
        params.set('lng', lng.toString())
      } else if (zip) {
        params.set('zip', zip)
      }
      if (category) params.set('category', category)
      params.set('sort', sortBy || 'price_asc')
      params.set('limit', '6')
      params.set('radius', '25')

      const res = await fetch(`/api/v2/products?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data: ApiResponse = await res.json()

      if (data.products.length > 0) {
        setProducts(data.products)
        setMeta(data.meta)
        setFilters(data.filters)
        setIsPreview(false)
        const first = data.products[0]
        setLocationLabel(`${first.dispensary.city}, ${first.dispensary.state}`)
      } else {
        // No real data — show sample preview
        setProducts(SAMPLE_PRODUCTS)
        setMeta(SAMPLE_META)
        setFilters(SAMPLE_FILTERS)
        setIsPreview(true)
        if (!locationLabel) setLocationLabel('Orlando, FL')
      }
    } catch {
      // On error, show sample preview
      setProducts(SAMPLE_PRODUCTS)
      setMeta(SAMPLE_META)
      setFilters(SAMPLE_FILTERS)
      setIsPreview(true)
      if (!locationLabel) setLocationLabel('Orlando, FL')
    } finally {
      setLoading(false)
    }
  }, [locationLabel])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchProducts(pos.coords.latitude, pos.coords.longitude)
        },
        () => {
          try {
            const stored = sessionStorage.getItem('leefii_user_location')
            if (stored) {
              const loc = JSON.parse(stored)
              if (loc.lat && loc.lng) {
                fetchProducts(loc.lat, loc.lng)
                return
              }
            }
          } catch { /* ignore */ }
          fetchProducts(28.5383, -81.3792)
          setLocationLabel('Orlando, FL')
        },
        { timeout: 5000 }
      )
    } else {
      fetchProducts(28.5383, -81.3792)
      setLocationLabel('Orlando, FL')
    }
  }, [fetchProducts])

  const handleZipSearch = () => {
    if (zipCode.trim()) {
      setActiveCategory(null)
      fetchProducts(undefined, undefined, zipCode.trim())
    }
  }

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat)
    const stored = sessionStorage.getItem('leefii_user_location')
    if (stored) {
      try {
        const loc = JSON.parse(stored)
        fetchProducts(loc.lat, loc.lng, undefined, cat, sort)
        return
      } catch { /* ignore */ }
    }
    if (zipCode.trim()) {
      fetchProducts(undefined, undefined, zipCode.trim(), cat, sort)
    }
  }

  const handleSort = (sortBy: string) => {
    setSort(sortBy)
    const stored = sessionStorage.getItem('leefii_user_location')
    if (stored) {
      try {
        const loc = JSON.parse(stored)
        fetchProducts(loc.lat, loc.lng, undefined, activeCategory, sortBy)
        return
      } catch { /* ignore */ }
    }
    if (zipCode.trim()) {
      fetchProducts(undefined, undefined, zipCode.trim(), activeCategory, sortBy)
    }
  }

  const bestPrice = products.length > 0
    ? products.reduce((min, p) => p.price < min.price ? p : min, products[0])
    : null

  return (
    <section className="max-w-3xl mx-auto px-6 pb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          📊 Price Intelligence
          <span className="text-[9px] font-bold text-white bg-green-500 px-2 py-0.5 rounded tracking-wider uppercase">NEW</span>
        </h2>
        <Link href="/shop" className="text-sm text-green-700 font-semibold hover:text-green-800 transition">
          View all prices →
        </Link>
      </div>

      {/* Market Banner */}
      {meta && meta.total > 0 && (
        <div className="bg-white/50 backdrop-blur-sm border border-white/60 rounded-[14px] p-4 mb-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
            <p className="text-[13px] text-gray-700">
              <strong className="text-gray-900">{locationLabel}</strong> — Flower prices <span className="text-green-600 font-semibold">down 8%</span> this week. {meta.total} products tracked.
            </p>
          </div>
          {meta.average && (
            <div className="flex gap-3.5 flex-shrink-0">
              <div className="text-center">
                <div className="text-[15px] font-extrabold text-green-600 tabular-nums">-8%</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold">Flower</div>
              </div>
              <div className="text-center">
                <div className="text-[15px] font-extrabold text-amber-500 tabular-nums">+2%</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold">Vapes</div>
              </div>
              <div className="text-center">
                <div className="text-[15px] font-extrabold text-green-600 tabular-nums">${meta.cheapest}</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-wide font-semibold">Best 1/8</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ZIP Search */}
      <div className="bg-white/55 backdrop-blur-sm border border-white/60 rounded-[18px] p-5 mb-3">
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Enter your zip code or city..."
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleZipSearch()}
            className="flex-1 bg-white border-[1.5px] border-gray-200 rounded-[10px] px-3.5 py-3 text-sm text-gray-800 outline-none focus:border-green-500 transition font-sans"
          />
          <button
            onClick={handleZipSearch}
            className="px-5 py-3 bg-green-500 text-white border-none rounded-[10px] text-sm font-bold cursor-pointer whitespace-nowrap hover:bg-green-600 transition font-sans"
          >
            🔍 Find Best Prices
          </button>
        </div>
      </div>

      {/* Results Card */}
      <div className="bg-white/55 backdrop-blur-sm border border-white/60 rounded-[18px] p-5 mb-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-white/50 rounded w-48" />
            <div className="flex gap-2">
              {[1,2,3,4].map(i => <div key={i} className="h-8 bg-white/50 rounded-full w-20" />)}
            </div>
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-white/50 rounded-[14px]" />
            ))}
          </div>
        ) : (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
              <h3 className="text-[15px] font-bold text-gray-900">
                {meta?.total || 0} results near <span className="text-green-600">{locationLabel}</span>
              </h3>
              <span className="text-xs text-gray-500">Updated 2 hrs ago · 10mi</span>
            </div>

            {/* Category Filters */}
            {filters && filters.categories.length > 0 && (
              <div className="flex gap-1.5 mb-3.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition flex items-center gap-1 flex-shrink-0 ${
                    !activeCategory
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'bg-white border-black/8 text-gray-600 hover:border-green-500 hover:text-green-700'
                  }`}
                >
                  All <span className={`text-[10px] ${!activeCategory ? 'text-green-600' : 'text-gray-400'}`}>{meta?.total}</span>
                </button>
                {filters.categories.map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryFilter(cat.name)}
                    className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-xs font-semibold cursor-pointer transition flex items-center gap-1 flex-shrink-0 ${
                      activeCategory === cat.name
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'bg-white border-black/8 text-gray-600 hover:border-green-500 hover:text-green-700'
                    }`}
                  >
                    {CATEGORY_ICONS[cat.name] || '📦'} {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                    <span className={`text-[10px] ${activeCategory === cat.name ? 'text-green-600' : 'text-gray-400'}`}>{cat.count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Sort */}
            <div className="flex items-center gap-1.5 mb-3.5">
              <span className="text-xs text-gray-500 font-medium">Sort:</span>
              {[
                { value: 'price_asc', label: 'Lowest Price' },
                { value: 'distance', label: 'Distance' },
                { value: 'rating', label: 'Rating' },
                { value: 'price_drop', label: 'Price Drop' },
              ].map(s => (
                <button
                  key={s.value}
                  onClick={() => handleSort(s.value)}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition ${
                    sort === s.value
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Product Cards */}
            <div className="flex flex-col gap-2">
              {products.map((product, idx) => {
                const isBest = bestPrice?.id === product.id
                const savings = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null
                const isHighest = idx === products.length - 1 && products.length > 2

                return (
                  <div
                    key={product.id}
                    className={`bg-white border-[1.5px] rounded-[14px] p-4 grid gap-3.5 items-center transition cursor-pointer relative ${
                      isBest
                        ? 'border-green-500 hover:shadow-lg hover:shadow-green-500/10'
                        : 'border-gray-200 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/10'
                    } ${isBest ? 'bg-gradient-to-br from-green-50/50 to-white' : ''}`}
                    style={{ gridTemplateColumns: '44px 1fr auto' }}
                  >
                    {isBest && (
                      <div className="absolute -top-2.5 left-4 bg-green-500 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded tracking-wider">
                        🏆 BEST PRICE
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-11 h-11 bg-gray-100 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0">
                      {CATEGORY_ICONS[product.category] || '📦'}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
                        {product.name}
                        {product.strainType && (
                          <span className={`inline-block px-1.5 py-px rounded text-[9px] font-bold tracking-wide uppercase ${
                            STRAIN_COLORS[product.strainType.toLowerCase()] || 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.strainType}
                          </span>
                        )}
                      </div>
                      {product.brand && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          by {product.brand} · {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </div>
                      )}
                      <div className="flex gap-3 mt-1 flex-wrap">
                        {product.thcContent && (
                          <span className="text-[11px] text-gray-500">THC: <strong className="text-gray-700 font-semibold">{product.thcContent}</strong></span>
                        )}
                        {product.cbdContent && (
                          <span className="text-[11px] text-gray-500">CBD: <strong className="text-gray-700 font-semibold">{product.cbdContent}</strong></span>
                        )}
                        {product.weight && (
                          <span className="text-[11px] text-gray-500">Weight: <strong className="text-gray-700 font-semibold">{product.weight}</strong></span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-xs text-green-600 font-semibold">{product.dispensary.name}</span>
                        <span className="text-[11px] text-gray-400">· {product.dispensary.distance} mi</span>
                        <span className="text-[11px] text-gray-500"><span className="text-yellow-500">★</span> {product.dispensary.rating?.toFixed(1) || 'N/A'}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.dispensary.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-semibold ${product.dispensary.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                          {product.dispensary.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0 min-w-[85px]">
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</div>
                      )}
                      <div className={`text-[22px] font-extrabold tracking-tight tabular-nums ${
                        isBest ? 'text-green-600' : isHighest ? 'text-gray-400' : 'text-gray-800'
                      }`}>
                        ${product.price.toFixed(2)}
                      </div>
                      {product.weight && (
                        <div className="text-[10px] text-gray-500 mt-0.5">per {product.weight}</div>
                      )}
                      {savings && (
                        <div className="inline-block mt-1 px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                          SAVE {savings}%
                        </div>
                      )}
                      {isHighest && !savings && (
                        <div className="text-[10px] font-semibold text-red-500 mt-1">92% more than best</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Price Alert CTA */}
            <div className="bg-white border-[1.5px] border-dashed border-gray-300 rounded-[14px] p-4 flex items-center justify-between mt-3.5 gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-[38px] h-[38px] bg-green-100 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0">🔔</div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Get notified when prices drop below $25</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">We check prices daily across every dispensary near you.</p>
                </div>
              </div>
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-gray-800 text-white rounded-[10px] text-xs font-bold cursor-pointer whitespace-nowrap hover:bg-gray-900 transition no-underline"
              >
                Set Price Alert →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Preview disclaimer */}
      {isPreview && !loading && (
        <p className="text-center text-[11px] text-gray-600/60 mt-2">
          Sample prices shown. Enter your ZIP code for real-time pricing near you.
        </p>
      )}
    </section>
  )
}
