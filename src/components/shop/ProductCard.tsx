import Link from 'next/link'

export interface ProductData {
  id: string
  name: string
  brand: string | null
  category: string
  subcategory: string | null
  price: number
  originalPrice: number | null
  weight: string | null
  thcContent: string | null
  cbdContent: string | null
  strainType: string | null
  imageUrl: string | null
  isOnSale: boolean
  lastScrapedAt: string | null
  dispensary: {
    name: string
    slug: string
    distance: number
    rating: number
    city: string
    state: string
    isOpen: boolean
    website?: string | null
    phone?: string | null
  }
}

export default function ProductCard({ product }: { product: ProductData }) {
  const { dispensary } = product
  const discountPct =
    product.originalPrice && product.isOnSale && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${dispensary.name} ${dispensary.city} ${dispensary.state}`
  )}`

  // Phone link for calling the dispensary
  const phoneUrl = dispensary.phone
    ? `tel:${dispensary.phone.replace(/[^\d+]/g, '')}`
    : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition relative flex flex-col h-full">
      {/* Discount badge */}
      {discountPct && discountPct > 0 && (
        <span className="absolute -top-3 right-4 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-sm">
          {discountPct}% OFF
        </span>
      )}

      {/* Product image */}
      {product.imageUrl ? (
        <div className="w-full h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-3xl">
            {product.category === 'flower'
              ? '🌿'
              : product.category === 'edibles'
                ? '🍪'
                : product.category === 'vapes'
                  ? '💨'
                  : product.category === 'concentrates'
                    ? '💎'
                    : product.category === 'pre-rolls'
                      ? '🚬'
                      : product.category === 'tinctures'
                        ? '💧'
                        : product.category === 'topicals'
                          ? '🧴'
                          : '🌱'}
          </span>
        </div>
      )}

      {/* Category badge */}
      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium w-fit capitalize mb-2">
        {product.category}
      </span>

      {/* Product name + brand */}
      <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2">
        {product.name}
      </h3>
      {product.brand && (
        <p className="text-sm text-gray-500 mt-0.5">{product.brand}</p>
      )}

      {/* Price row */}
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-xl font-bold text-green-600">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && product.isOnSale && product.originalPrice > product.price && (
          <span className="text-sm text-gray-400 line-through">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.weight && (
          <span className="text-sm text-gray-500">/ {product.weight}</span>
        )}
      </div>

      {/* THC + strain type badges */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {product.thcContent && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            THC: {product.thcContent}
          </span>
        )}
        {product.cbdContent && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            CBD: {product.cbdContent}
          </span>
        )}
        {product.strainType && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium capitalize">
            {product.strainType}
          </span>
        )}
        {product.isOnSale && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-medium">
            Sale
          </span>
        )}
      </div>

      {/* Dispensary info */}
      <div className="mt-auto pt-3 border-t border-gray-100 mt-4">
        <Link
          href={`/dispensary/${dispensary.slug}`}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition"
        >
          {dispensary.name}
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 flex-wrap">
          <span>{dispensary.distance} mi</span>
          <span className="text-gray-300">|</span>
          <span>
            {dispensary.city}, {dispensary.state}
          </span>
          <span className="text-gray-300">|</span>
          <span className={dispensary.isOpen ? 'text-green-600 font-medium' : 'text-red-500'}>
            {dispensary.isOpen ? 'Open Now' : 'Closed'}
          </span>
          {dispensary.rating > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <span className="text-amber-500">★ {dispensary.rating.toFixed(1)}</span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        {/* Primary action: Call to order (if phone available) or View Full Menu */}
        {phoneUrl ? (
          <a
            href={phoneUrl}
            className="inline-flex items-center justify-center flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call to Order
          </a>
        ) : (
          <Link
            href={`/dispensary/${dispensary.slug}`}
            className="inline-flex items-center justify-center flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View Full Menu
          </Link>
        )}
        {/* Secondary: Directions */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center flex-1 px-4 py-2.5 border-2 border-green-600 text-green-600 text-sm font-medium rounded-lg hover:bg-green-50 transition"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Directions
        </a>
      </div>
      {/* Helpful context for the user */}
      <p className="text-xs text-gray-400 text-center mt-1.5 italic">
        {phoneUrl
          ? 'Call and mention this price — tell them you found it on Leefii!'
          : 'Tell them you found it on Leefii!'}
      </p>
    </div>
  )
}
