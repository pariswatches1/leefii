'use client'

import { useState } from 'react'
import Link from 'next/link'

type BusinessHour = {
  dayOfWeek: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

export type SerializedDispensary = {
  id: string
  slug: string
  name: string
  address: string
  phone: string | null
  licenseType: string
  hasDelivery: boolean
  hasStorefront: boolean
  hasCurbside: boolean
  acceptsCreditCard: boolean
  rating: number | null
  reviewsCount: number
  isPremium: boolean
  BusinessHours: BusinessHour[]
}

type Filter = 'all' | 'recreational' | 'medical' | 'delivery' | 'open-now' | 'top-rated'

function isCurrentlyOpen(businessHours: BusinessHour[]): { open: boolean; closeTime?: string } {
  if (!businessHours || businessHours.length === 0) return { open: false }
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const now = new Date()
  const todayName = days[now.getDay()]
  const currentTime = now.toTimeString().slice(0, 5)
  const todayHours = businessHours.find((h) => h.dayOfWeek === todayName)
  if (!todayHours || todayHours.isClosed) return { open: false }
  const isOpen = currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime
  return { open: isOpen, closeTime: todayHours.closeTime }
}

export default function CityDispensaryFilters({ dispensaries }: { dispensaries: SerializedDispensary[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered = dispensaries.filter((d) => {
    switch (activeFilter) {
      case 'recreational':
        return d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH'
      case 'medical':
        return d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH'
      case 'delivery':
        return d.hasDelivery
      case 'open-now':
        return isCurrentlyOpen(d.BusinessHours).open
      case 'top-rated':
        return d.rating !== null && d.rating >= 4.0
      default:
        return true
    }
  })

  const sorted = activeFilter === 'top-rated'
    ? [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    : filtered

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: dispensaries.length },
    { key: 'recreational', label: 'Recreational', count: dispensaries.filter((d) => d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH').length },
    { key: 'medical', label: 'Medical', count: dispensaries.filter((d) => d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH').length },
    { key: 'delivery', label: 'Delivery', count: dispensaries.filter((d) => d.hasDelivery).length },
    { key: 'open-now', label: 'Open Now' },
    { key: 'top-rated', label: 'Top Rated', count: dispensaries.filter((d) => d.rating !== null && d.rating >= 4.0).length },
  ]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeFilter === f.key
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}{f.count !== undefined ? ` (${f.count})` : ''}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing {sorted.length} of {dispensaries.length} dispensaries
      </p>

      <div className="grid gap-4">
        {sorted.map((dispensary) => {
          const status = isCurrentlyOpen(dispensary.BusinessHours)
          return (
            <Link
              key={dispensary.id}
              href={`/dispensary/${dispensary.slug}`}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition block"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {dispensary.isPremium && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Featured</span>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">{dispensary.name}</h2>
                    {status.open ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Open{status.closeTime ? ` until ${status.closeTime}` : ''}</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">Closed</span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">{dispensary.address}</p>
                  <div className="flex flex-wrap gap-2 text-xs mt-2">
                    <span className="text-gray-500">
                      {dispensary.licenseType === 'BOTH' ? 'Rec & Med' : dispensary.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                    </span>
                    {dispensary.hasDelivery && <span className="text-blue-600 font-medium">Delivers</span>}
                    {dispensary.acceptsCreditCard && <span className="text-gray-500">Cards Accepted</span>}
                    {dispensary.hasCurbside && <span className="text-gray-500">Curbside</span>}
                  </div>
                </div>
                <div className="text-right ml-4">
                  {dispensary.rating && dispensary.rating > 0 ? (
                    <>
                      <span className="text-yellow-500 font-bold text-lg">&#9733; {dispensary.rating.toFixed(1)}</span>
                      <p className="text-xs text-gray-400">{dispensary.reviewsCount} reviews</p>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          )
        })}
        {sorted.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No dispensaries match this filter</p>
            <p className="text-sm mt-1">Try a different filter option</p>
          </div>
        )}
      </div>
    </div>
  )
}
