'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import TrustBadge from './TrustBadge'

type SerializedDispensary = {
  id: string
  name: string
  slug: string
  address: string
  isPremium: boolean
  rating: number | null
  reviewsCount: number
  licenseType: string
  hasDelivery: boolean
  hasCurbside: boolean
  acceptsCreditCard: boolean
  verificationDate: string | null
  verificationMethod: string | null
  verificationStatus: string
  isClaimed: boolean
  isOpen: boolean
  closeTime?: string
}

type SortOption = 'top_rated' | 'recently_verified'

export default function DispensaryListFilters({
  dispensaries,
}: {
  dispensaries: SerializedDispensary[]
}) {
  const [sortBy, setSortBy] = useState<SortOption>('top_rated')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const filtered = useMemo(() => {
    let result = [...dispensaries]

    if (verifiedOnly) {
      result = result.filter((d) => d.verificationDate !== null)
    }

    if (sortBy === 'recently_verified') {
      result.sort((a, b) => {
        // Verified dispensaries first, then by date
        if (a.verificationDate && !b.verificationDate) return -1
        if (!a.verificationDate && b.verificationDate) return 1
        if (a.verificationDate && b.verificationDate) {
          return new Date(b.verificationDate).getTime() - new Date(a.verificationDate).getTime()
        }
        // Fall back to rating for unverified
        return (b.rating ?? 0) - (a.rating ?? 0)
      })
    }
    // top_rated keeps the original server-side order (isPremium desc, rating desc)

    return result
  }, [dispensaries, sortBy, verifiedOnly])

  return (
    <div>
      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-gray-500">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="top_rated">Top Rated</option>
              <option value="recently_verified">Recently Verified</option>
            </select>
          </div>
        </div>

        {/* Verified Only toggle */}
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            verifiedOnly
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Verified Only
        </button>
      </div>

      {/* Dispensary List */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No verified dispensaries found yet.</p>
            <button
              onClick={() => setVerifiedOnly(false)}
              className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Show all dispensaries
            </button>
          </div>
        ) : (
          filtered.map((dispensary) => {
            const isVerified = dispensary.verificationDate !== null
            return (
              <Link
                key={dispensary.id}
                href={`/dispensary/${dispensary.slug}`}
                className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition block ${
                  isVerified ? 'border-green-200 shadow-green-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {dispensary.isPremium && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Featured</span>
                      )}
                      <h2 className="text-xl font-semibold text-gray-900">{dispensary.name}</h2>
                      {dispensary.isOpen ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Open{dispensary.closeTime ? ` · Closes ${dispensary.closeTime}` : ''}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">Closed</span>
                      )}
                      <TrustBadge
                        verificationDate={dispensary.verificationDate}
                        verificationMethod={dispensary.verificationMethod}
                        verificationStatus={dispensary.verificationStatus}
                        verifiedBy={null}
                        isClaimed={dispensary.isClaimed}
                        size="mini"
                      />
                    </div>
                    <p className="text-gray-600 mb-1">{dispensary.address}</p>
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                      <span className="text-gray-500">
                        {dispensary.licenseType === 'BOTH' ? 'Rec & Med' : dispensary.licenseType === 'RECREATIONAL' ? 'Recreational' : 'Medical'}
                      </span>
                      {dispensary.hasDelivery && <span className="text-blue-600 font-medium">Delivers</span>}
                      {dispensary.acceptsCreditCard && <span className="text-gray-500">Cards</span>}
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
          })
        )}
      </div>
    </div>
  )
}
