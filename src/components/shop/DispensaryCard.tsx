import Link from 'next/link'

export interface NearbyDispensary {
  id: string
  name: string
  slug: string
  distance: number
  rating: number
  reviewsCount: number
  city: string
  state: string
  address: string
  phone: string | null
  hasDelivery: boolean
  hasStorefront: boolean
  licenseType: string
  isOpen: boolean
  productCount: number
  lowestPrice: number | null
  avgPrice: number | null
}

export default function DispensaryCard({ dispensary }: { dispensary: NearbyDispensary }) {
  return (
    <Link
      href={`/dispensary/${dispensary.slug}#menu`}
      className="group block bg-white rounded-xl border border-gray-200 hover:border-[#7FE800] hover:shadow-lg transition-all duration-200 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Dispensary name */}
          <h3 className="text-lg font-semibold text-[#0C1A05] group-hover:text-[#1E7A00] transition-colors truncate">
            {dispensary.name}
          </h3>

          {/* Location + distance */}
          <p className="text-sm text-gray-500 mt-0.5">
            {dispensary.address} · {dispensary.city}, {dispensary.state}
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${dispensary.isOpen ? 'bg-[#1E7A00]/10 text-[#1E7A00]' : 'bg-gray-100 text-gray-500'}`}>
              {dispensary.isOpen ? 'Open Now' : 'Closed'}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {dispensary.distance} mi away
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
              {dispensary.licenseType === 'MEDICAL' ? 'Medical' : dispensary.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Med & Rec'}
            </span>
            {dispensary.hasDelivery && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
                Delivery
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        {dispensary.rating > 0 && (
          <div className="text-center shrink-0">
            <div className="text-2xl font-bold text-[#0C1A05]">{dispensary.rating.toFixed(1)}</div>
            <div className="text-amber-500 text-sm">★★★★★</div>
            {dispensary.reviewsCount > 0 && (
              <div className="text-[11px] text-gray-400 mt-0.5">{dispensary.reviewsCount} reviews</div>
            )}
          </div>
        )}
      </div>

      {/* Menu stats bar */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs text-gray-500">Products</div>
            <div className="text-sm font-semibold text-[#0C1A05]">{dispensary.productCount.toLocaleString()}</div>
          </div>
          {dispensary.lowestPrice !== null && (
            <div>
              <div className="text-xs text-gray-500">Starting at</div>
              <div className="text-sm font-bold text-[#1E7A00]">${dispensary.lowestPrice.toFixed(2)}</div>
            </div>
          )}
          {dispensary.avgPrice !== null && (
            <div>
              <div className="text-xs text-gray-500">Avg price</div>
              <div className="text-sm font-medium text-gray-700">${dispensary.avgPrice.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Browse Menu button */}
        <div className="px-4 py-2 bg-[#0C1A05] text-[#7FE800] text-sm font-semibold rounded-lg group-hover:bg-[#1E7A00] group-hover:text-white transition-colors shrink-0">
          Browse Menu →
        </div>
      </div>
    </Link>
  )
}
