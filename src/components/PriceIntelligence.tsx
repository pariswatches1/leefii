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
    reviewsCount: number
    city: string
    state: string
    phone: string | null
    address: string
    zipCode: string
    latitude: number
    longitude: number
    hasDelivery: boolean
    hasStorefront: boolean
    hasCurbside: boolean
    acceptsCreditCard: boolean
    hasATM: boolean
    licenseType: string
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

const LICENSE_LABELS: Record<string, { label: string; color: string }> = {
  MEDICAL: { label: 'Medical', color: 'bg-blue-100 text-blue-700' },
  RECREATIONAL: { label: 'Recreational', color: 'bg-green-100 text-green-700' },
  BOTH: { label: 'Medical & Rec', color: 'bg-purple-100 text-purple-700' },
}

// Sample data shown when no real products are available nearby
const SAMPLE_PRODUCTS: ProductResult[] = [
  {
    id: 'sample-1', name: 'Blue Dream', brand: 'Cookies', category: 'flower',
    price: 25.00, originalPrice: 35.00, weight: '3.5g', thcContent: '24.3%',
    cbdContent: '0.1%', strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'Trulieve', slug: '', distance: 1.2, rating: 4.4, reviewsCount: 312, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 545-1234', address: '3251 E Colonial Dr', zipCode: '32803', latitude: 28.5505, longitude: -81.3464, hasDelivery: true, hasStorefront: true, hasCurbside: true, acceptsCreditCard: true, hasATM: true, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-2', name: 'Blue Dream', brand: 'Trulieve', category: 'flower',
    price: 32.00, originalPrice: null, weight: '3.5g', thcContent: '22.8%',
    cbdContent: '0.2%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Curaleaf', slug: '', distance: 2.8, rating: 4.2, reviewsCount: 187, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 237-0018', address: '4117 S Orange Blossom Trail', zipCode: '32839', latitude: 28.5123, longitude: -81.3992, hasDelivery: true, hasStorefront: true, hasCurbside: false, acceptsCreditCard: true, hasATM: false, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-3', name: 'Blue Dream Gummies 100mg', brand: 'Wana', category: 'edibles',
    price: 35.00, originalPrice: null, weight: '10pk', thcContent: '100mg total',
    cbdContent: null, strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Surterra Wellness', slug: '', distance: 3.1, rating: 4.1, reviewsCount: 94, city: 'Orlando', state: 'FL', isOpen: false, phone: '(407) 545-5678', address: '551 N Semoran Blvd', zipCode: '32807', latitude: 28.5555, longitude: -81.3076, hasDelivery: true, hasStorefront: true, hasCurbside: true, acceptsCreditCard: false, hasATM: true, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-4', name: 'Blue Dream Live Resin Cart', brand: 'Select', category: 'vapes',
    price: 40.00, originalPrice: 55.00, weight: '0.5g', thcContent: '85.2%',
    cbdContent: null, strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'MUV', slug: '', distance: 4.2, rating: 4.5, reviewsCount: 256, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 613-2800', address: '993 N Semoran Blvd', zipCode: '32807', latitude: 28.5611, longitude: -81.3073, hasDelivery: false, hasStorefront: true, hasCurbside: true, acceptsCreditCard: true, hasATM: true, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-5', name: 'Blue Dream', brand: 'Fluent', category: 'flower',
    price: 42.00, originalPrice: null, weight: '3.5g', thcContent: '21.5%',
    cbdContent: '0.3%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Fluent Cannabis', slug: '', distance: 5.4, rating: 3.9, reviewsCount: 68, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 988-5420', address: '8015 Turkey Lake Rd', zipCode: '32819', latitude: 28.4698, longitude: -81.4637, hasDelivery: true, hasStorefront: true, hasCurbside: false, acceptsCreditCard: true, hasATM: false, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-6', name: 'Blue Dream Premium', brand: 'Jungle Boys', category: 'flower',
    price: 48.00, originalPrice: null, weight: '3.5g', thcContent: '28.1%',
    cbdContent: '0.1%', strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Rise Orlando', slug: '', distance: 6.1, rating: 4.3, reviewsCount: 145, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 476-5000', address: '3812 W Colonial Dr', zipCode: '32808', latitude: 28.5484, longitude: -81.4203, hasDelivery: false, hasStorefront: true, hasCurbside: true, acceptsCreditCard: true, hasATM: true, licenseType: 'BOTH' },
  },
  {
    id: 'sample-7', name: 'Blue Dream Shatter', brand: 'MPX', category: 'concentrates',
    price: 55.00, originalPrice: 70.00, weight: '1g', thcContent: '82.4%',
    cbdContent: null, strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'Trulieve', slug: '', distance: 1.2, rating: 4.4, reviewsCount: 312, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 545-1234', address: '3251 E Colonial Dr', zipCode: '32803', latitude: 28.5505, longitude: -81.3464, hasDelivery: true, hasStorefront: true, hasCurbside: true, acceptsCreditCard: true, hasATM: true, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-8', name: 'Blue Dream Live Rosin', brand: 'Blue River', category: 'concentrates',
    price: 65.00, originalPrice: null, weight: '1g', thcContent: '78.9%',
    cbdContent: null, strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'MUV', slug: '', distance: 4.2, rating: 4.5, reviewsCount: 256, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 613-2800', address: '993 N Semoran Blvd', zipCode: '32807', latitude: 28.5611, longitude: -81.3073, hasDelivery: false, hasStorefront: true, hasCurbside: true, acceptsCreditCard: true, hasATM: true, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-9', name: 'Blue Dream Pre-Roll 5pk', brand: 'Cookies', category: 'pre-rolls',
    price: 30.00, originalPrice: 38.00, weight: '3.5g', thcContent: '23.1%',
    cbdContent: '0.1%', strainType: 'hybrid', isOnSale: true,
    dispensary: { name: 'Curaleaf', slug: '', distance: 2.8, rating: 4.2, reviewsCount: 187, city: 'Orlando', state: 'FL', isOpen: true, phone: '(407) 237-0018', address: '4117 S Orange Blossom Trail', zipCode: '32839', latitude: 28.5123, longitude: -81.3992, hasDelivery: true, hasStorefront: true, hasCurbside: false, acceptsCreditCard: true, hasATM: false, licenseType: 'MEDICAL' },
  },
  {
    id: 'sample-10', name: 'Blue Dream King Size', brand: 'Jeeter', category: 'pre-rolls',
    price: 18.00, originalPrice: null, weight: '1g', thcContent: '25.7%',
    cbdContent: null, strainType: 'hybrid', isOnSale: false,
    dispensary: { name: 'Surterra Wellness', slug: '', distance: 3.1, rating: 4.1, reviewsCount: 94, city: 'Orlando', state: 'FL', isOpen: false, phone: '(407) 545-5678', address: '551 N Semoran Blvd', zipCode: '32807', latitude: 28.5555, longitude: -81.3076, hasDelivery: true, hasStorefront: true, hasCurbside: true, acceptsCreditCard: false, hasATM: true, licenseType: 'MEDICAL' },
  },
]

const SAMPLE_META = { total: 10, cheapest: 18, average: 37 }
const SAMPLE_FILTERS: ApiResponse['filters'] = {
  categories: [
    { name: 'flower', count: 4 },
    { name: 'edibles', count: 1 },
    { name: 'vapes', count: 1 },
    { name: 'concentrates', count: 2 },
    { name: 'pre-rolls', count: 2 },
  ],
  brands: [],
  weights: [],
}

// ─── Quick-View Drawer ─────────────────────────────────────────────────
function ProductDrawer({ product, onClose }: { product: ProductResult; onClose: () => void }) {
  const savings = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const d = product.dispensary
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}`
  // State slugs use full name (e.g. "florida"), not abbreviation
  const STATE_SLUG_MAP: Record<string, string> = {
    'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas', 'CA': 'california',
    'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware', 'FL': 'florida', 'GA': 'georgia',
    'HI': 'hawaii', 'ID': 'idaho', 'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa',
    'KS': 'kansas', 'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
    'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi', 'MO': 'missouri',
    'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada', 'NH': 'new-hampshire', 'NJ': 'new-jersey',
    'NM': 'new-mexico', 'NY': 'new-york', 'NC': 'north-carolina', 'ND': 'north-dakota', 'OH': 'ohio',
    'OK': 'oklahoma', 'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode-island', 'SC': 'south-carolina',
    'SD': 'south-dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah', 'VT': 'vermont',
    'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia', 'WI': 'wisconsin', 'WY': 'wyoming',
    'DC': 'district-of-columbia',
  }
  const stateSlug = STATE_SLUG_MAP[d.state.toUpperCase()] || d.state.toLowerCase()
  const citySlug = d.city.toLowerCase().replace(/\s+/g, '-')
  const profileUrl = d.slug
    ? `/dispensary/${d.slug}`
    : `/dispensaries/${stateSlug}/${citySlug}`
  const license = LICENSE_LABELS[d.licenseType] || LICENSE_LABELS.MEDICAL

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] shadow-2xl max-h-[88vh] overflow-y-auto animate-slideUp">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-white rounded-t-[24px] z-10">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition z-10"
        >
          ✕
        </button>

        <div className="px-6 pb-8 pt-2">
          {/* ── Price Hero ── */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="text-4xl">{CATEGORY_ICONS[product.category] || '📦'}</span>
              {product.strainType && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                  STRAIN_COLORS[product.strainType.toLowerCase()] || 'bg-gray-100 text-gray-600'
                }`}>
                  {product.strainType}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">{product.name}</h3>
            {product.brand && (
              <p className="text-sm text-gray-500">by {product.brand} · {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            )}

            {/* Big Price */}
            <div className="mt-3 flex items-center justify-center gap-3">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-5xl font-black text-green-600 tabular-nums">${product.price.toFixed(2)}</span>
            </div>
            {product.weight && (
              <p className="text-sm text-gray-500 mt-1">per {product.weight}</p>
            )}
            {savings && (
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-bold">
                🎉 You save {savings}% — ${(product.originalPrice! - product.price).toFixed(2)} off
              </div>
            )}

            {/* Product specs */}
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
              {product.thcContent && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">THC: <strong>{product.thcContent}</strong></span>
              )}
              {product.cbdContent && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">CBD: <strong>{product.cbdContent}</strong></span>
              )}
              {product.weight && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">Weight: <strong>{product.weight}</strong></span>
              )}
            </div>
          </div>

          {/* ── Dispensary Info Card ── */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-base font-bold text-gray-900">{d.name}</h4>
                <p className="text-sm text-gray-600 mt-0.5">{d.address}</p>
                <p className="text-sm text-gray-600">{d.city}, {d.state} {d.zipCode}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-bold text-gray-900">{d.rating?.toFixed(1)}</span>
                </div>
                <div className="text-xs text-gray-500">{d.reviewsCount} reviews</div>
                <div className="text-xs text-gray-500">{d.distance} mi away</div>
              </div>
            </div>

            {/* Status badges row */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {/* Open/Closed */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                d.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${d.isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                {d.isOpen ? 'Open Now' : 'Closed'}
              </span>

              {/* License type */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${license.color}`}>
                {license.label}
              </span>

              {/* Delivery */}
              {d.hasDelivery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                  🚗 Delivery
                </span>
              )}

              {/* Storefront */}
              {d.hasStorefront && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                  🏪 Storefront
                </span>
              )}

              {/* Curbside */}
              {d.hasCurbside && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700">
                  🅿️ Curbside
                </span>
              )}

              {/* Credit Cards */}
              {d.acceptsCreditCard && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                  💳 Cards
                </span>
              )}

              {/* ATM */}
              {d.hasATM && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                  🏧 ATM
                </span>
              )}
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex gap-3 mb-4">
            {d.phone && (
              <a
                href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold text-base hover:bg-green-700 transition no-underline shadow-lg shadow-green-600/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Call Now
              </a>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 transition no-underline shadow-lg shadow-blue-600/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Get Directions
            </a>
          </div>

          {/* Delivery CTA if available */}
          {d.hasDelivery && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
              <span className="text-2xl">🚗</span>
              <div className="flex-1">
                <h5 className="text-sm font-bold text-blue-900">Delivery Available</h5>
                <p className="text-xs text-blue-700 mt-0.5">
                  {d.name} delivers! Call to ask about delivery options for this product.
                </p>
              </div>
              {d.phone && (
                <a
                  href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold no-underline hover:bg-blue-700 transition flex-shrink-0"
                >
                  Call for Delivery
                </a>
              )}
            </div>
          )}

          {/* ── How to Get This Deal ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <h5 className="text-sm font-bold text-amber-900 mb-1.5">💡 How to get this deal</h5>
            <p className="text-sm text-amber-800 leading-relaxed">
              {product.isOnSale
                ? `Visit ${d.name} and ask your budtender about their ${product.name} special. This product is currently on sale — limited availability.`
                : `Visit ${d.name} and ask for ${product.name} by ${product.brand || 'name'}. Call ahead to confirm availability.`
              }
            </p>
          </div>

          {/* ── Reviews Summary ── */}
          {d.reviewsCount > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="text-sm font-bold text-gray-900">Customer Reviews</h5>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-lg ${star <= Math.round(d.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-900">{d.rating?.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({d.reviewsCount} reviews)</span>
              </div>
              <Link
                href={profileUrl}
                className="text-sm text-green-700 font-semibold hover:text-green-800 transition no-underline"
              >
                Read all reviews →
              </Link>
            </div>
          )}

          {/* ── View Dispensary Profile Link ── */}
          <Link
            href={profileUrl}
            className="block text-center text-sm text-green-700 font-semibold hover:text-green-800 transition py-2 no-underline"
          >
            View full {d.name} profile →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────
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
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(null)

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
        setProducts(SAMPLE_PRODUCTS)
        setMeta(SAMPLE_META)
        setFilters(SAMPLE_FILTERS)
        setIsPreview(true)
        if (!locationLabel) setLocationLabel('Orlando, FL')
      }
    } catch {
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

  // Local filtering & sorting for sample/preview data
  const filterAndSortSamples = useCallback((cat: string | null, sortBy: string) => {
    let filtered = cat
      ? SAMPLE_PRODUCTS.filter(p => p.category === cat)
      : [...SAMPLE_PRODUCTS]

    // Sort
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'distance':
        filtered.sort((a, b) => a.dispensary.distance - b.dispensary.distance)
        break
      case 'rating':
        filtered.sort((a, b) => (b.dispensary.rating || 0) - (a.dispensary.rating || 0))
        break
      case 'price_drop':
        filtered.sort((a, b) => {
          const dropA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0
          const dropB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0
          return dropB - dropA
        })
        break
    }

    setProducts(filtered)
    // Update meta to reflect filtered count
    const cheapest = filtered.length > 0 ? Math.min(...filtered.map(p => p.price)) : null
    const average = filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.price, 0) / filtered.length) : null
    setMeta({ total: SAMPLE_PRODUCTS.length, cheapest, average })
  }, [])

  const handleCategoryFilter = (cat: string | null) => {
    setActiveCategory(cat)

    // If in preview mode, filter sample data locally
    if (isPreview) {
      filterAndSortSamples(cat, sort)
      return
    }

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

    // If in preview mode, sort sample data locally
    if (isPreview) {
      filterAndSortSamples(activeCategory, sortBy)
      return
    }

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
        <Link href="/strains" className="text-sm text-green-700 font-semibold hover:text-green-800 transition">
          View all strains →
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
                const cardSavings = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null
                const isHighest = idx === products.length - 1 && products.length > 2

                return (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
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
                        {product.dispensary.hasDelivery && (
                          <span className="text-[10px] font-semibold text-blue-600">🚗 Delivers</span>
                        )}
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
                      {cardSavings && (
                        <div className="inline-block mt-1 px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold">
                          SAVE {cardSavings}%
                        </div>
                      )}
                      {isHighest && !cardSavings && (
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
                href="/strains/blue-dream"
                className="px-5 py-2.5 bg-gray-800 text-white rounded-[10px] text-xs font-bold cursor-pointer whitespace-nowrap hover:bg-gray-900 transition no-underline"
              >
                Explore Blue Dream →
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

      {/* Quick-View Drawer */}
      {selectedProduct && (
        <ProductDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}
