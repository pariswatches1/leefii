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

const STRAIN_COLORS: Record<string, { bg: string; text: string }> = {
  sativa: { bg: 'bg-amber-100', text: 'text-amber-700' },
  indica: { bg: 'bg-purple-100', text: 'text-purple-700' },
  hybrid: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  cbd: { bg: 'bg-blue-100', text: 'text-blue-700' },
}

const CATEGORY_ICONS: Record<string, string> = {
  flower: '🌿',
  edibles: '🍪',
  vapes: '💨',
  concentrates: '💎',
  'pre-rolls': '🚬',
  tinctures: '💧',
  topicals: '🧴',
}

export default function ProductCard({ product }: { product: ProductData }) {
  const { dispensary } = product
  const discountPct =
    product.originalPrice && product.isOnSale && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const strainStyle = product.strainType
    ? STRAIN_COLORS[product.strainType.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700' }
    : null

  return (
    <Link
      href={`/dispensary/${dispensary.slug}#menu`}
      className="group block bg-white rounded-xl border border-gray-200 hover:border-[#7FE800] hover:shadow-lg transition-all duration-200 relative flex flex-col h-full overflow-hidden"
    >
      {/* Sale badge */}
      {discountPct && discountPct > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow-sm">
          {discountPct}% OFF
        </div>
      )}

      {/* Product image */}
      {product.imageUrl ? (
        <div className="w-full h-44 bg-gray-50 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-[#0C1A05]/5 to-[#1E7A00]/10 flex items-center justify-center">
          <span className="text-4xl opacity-60">
            {CATEGORY_ICONS[product.category] || '🌱'}
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">
            {product.category}
          </span>
          {strainStyle && product.strainType && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${strainStyle.bg} ${strainStyle.text}`}>
              {product.strainType}
            </span>
          )}
          {product.thcContent && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1E7A00]/10 text-[#1E7A00] font-medium">
              THC {product.thcContent}
            </span>
          )}
        </div>

        {/* Product name */}
        <h3 className="text-[15px] font-semibold text-[#0C1A05] leading-snug line-clamp-2 group-hover:text-[#1E7A00] transition-colors">
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-bold text-[#1E7A00]">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.isOnSale && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
          {product.weight && (
            <span className="text-xs text-gray-500">/ {product.weight}</span>
          )}
        </div>

        {/* Dispensary info — this is the key section */}
        <div className="mt-auto pt-3 border-t border-gray-100 mt-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1E7A00] truncate">
                {dispensary.name}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 flex-wrap">
                <span>{dispensary.distance} mi</span>
                <span className="text-gray-300">·</span>
                <span>
                  {dispensary.city}, {dispensary.state}
                </span>
                {dispensary.rating > 0 && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-amber-500">★ {dispensary.rating.toFixed(1)}</span>
                  </>
                )}
              </div>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${dispensary.isOpen ? 'bg-[#1E7A00]/10 text-[#1E7A00]' : 'bg-gray-100 text-gray-500'}`}>
              {dispensary.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        {/* View Menu CTA */}
        <div className="mt-3 w-full py-2.5 bg-[#0C1A05] text-[#7FE800] text-sm font-semibold rounded-lg text-center group-hover:bg-[#1E7A00] group-hover:text-white transition-colors">
          View Full Menu →
        </div>
      </div>
    </Link>
  )
}
