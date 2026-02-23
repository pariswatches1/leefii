'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getVerificationTier } from '@/lib/verification'

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
  verificationDate: string | null
  verificationStatus: string
  verificationMethod: string | null
  isClaimed: boolean
  BusinessHours: BusinessHour[]
}

type Filter = 'all' | 'recreational' | 'medical' | 'delivery' | 'open-now' | 'top-rated' | 'verified'
type SortOption = 'default' | 'recently-verified' | 'top-rated' | 'most-reviews'

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
  const [sortBy, setSortBy] = useState<SortOption>('default')

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
      case 'verified':
        return d.verificationDate !== null
      default:
        return true
    }
  })

  const sorted = (() => {
    switch (sortBy) {
      case 'recently-verified':
        return [...filtered].sort((a, b) => {
          if (!a.verificationDate && !b.verificationDate) return 0
          if (!a.verificationDate) return 1
          if (!b.verificationDate) return -1
          return new Date(b.verificationDate).getTime() - new Date(a.verificationDate).getTime()
        })
      case 'top-rated':
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'most-reviews':
        return [...filtered].sort((a, b) => b.reviewsCount - a.reviewsCount)
      default:
        return activeFilter === 'top-rated'
          ? [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
          : filtered
    }
  })()

  const verifiedCount = dispensaries.filter((d) => d.verificationDate !== null).length

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: dispensaries.length },
    { key: 'verified', label: 'Verified', count: verifiedCount },
    { key: 'recreational', label: 'Recreational', count: dispensaries.filter((d) => d.licenseType === 'RECREATIONAL' || d.licenseType === 'BOTH').length },
    { key: 'medical', label: 'Medical', count: dispensaries.filter((d) => d.licenseType === 'MEDICAL' || d.licenseType === 'BOTH').length },
    { key: 'delivery', label: 'Delivery', count: dispensaries.filter((d) => d.hasDelivery).length },
    { key: 'open-now', label: 'Open Now' },
    { key: 'top-rated', label: 'Top Rated', count: dispensaries.filter((d) => d.rating !== null && d.rating >= 4.0).length },
  ]

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
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
            {f.key === 'verified' && (
              <svg className="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            {f.label}{f.count !== undefined ? ` (${f.count})` : ''}
          </button>
        ))}
      </div>

      {/* Sort + Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing {sorted.length} of {dispensaries.length} dispensaries
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white"
        >
          <option value="default">Sort: Default</option>
          <option value="recently-verified">Recently Verified</option>
          <option value="top-rated">Highest Rated</option>
          <option value="most-reviews">Most Reviews</option>
        </select>
      </div>

      {/* Cards */}
      <div className="grid gap-4">
        {sorted.map((dispensary) => {
          const status = isCurrentlyOpen(dispensary.BusinessHours)
          const vInfo = getVerificationTier(dispensary.verificationDate)
          const isVerified = vInfo.tier !== 'unverified'

          return (
            <Link
              key={dispensary.id}
              href={`/dispensary/${dispensary.slug}`}
              className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition block ${
                isVerified ? `border-l-4 ${vInfo.borderClass}` : ''
              }`}
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
                    {/* Verification badge */}
                    {isVerified && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${vInfo.bgClass} ${vInfo.textClass}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {vInfo.tier === 'verified-today' ? 'Verified' : vInfo.label}
                      </span>
                    )}
                    {dispensary.isClaimed && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Claimed</span>
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
