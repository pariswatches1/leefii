'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocation } from './LocationDetector'

interface Deal {
  id: string
  title: string
  slug: string
  description: string | null
  discountType: string | null
  discountValue: number | null
  dispensaryName: string | null
  dispensarySlug: string | null
  stateSlug: string | null
  citySlug: string | null
  isOngoing: boolean
  endDate: string | null
  code: string | null
  isFeatured: boolean
}

function DiscountBadge({ type, value }: { type: string | null; value: number | null }) {
  if (!type) return null
  let label = type.toUpperCase()
  if (type === 'percentage' && value) label = `${value}% OFF`
  else if (type === 'dollar' && value) label = `$${value} OFF`
  return (
    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
      {label}
    </span>
  )
}

export default function NearbyDeals() {
  const { location, loading: locationLoading, setLocation } = useLocation()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationInfo, setLocationInfo] = useState<{
    stateSlug: string
    stateName: string
    citySlug: string
  } | null>(null)

  // Location changer state
  const [isChangerOpen, setIsChangerOpen] = useState(false)
  const [locationInput, setLocationInput] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
    if (locationLoading) return
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchDeals() {
      try {
        const response = await fetch(
          `/api/deals/nearby?lat=${location!.lat}&lng=${location!.lng}&limit=6`
        )
        if (cancelled) return
        const data = await response.json()
        if (response.ok && data.deals) {
          setDeals(data.deals)
          setLocationInfo(data.location)
          setError(null)
        } else {
          setError(data.error || 'Failed to load')
        }
      } catch {
        if (!cancelled) setError('Failed to load nearby deals')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDeals()
    return () => { cancelled = true }
  }, [location, locationLoading])

  async function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!locationInput.trim()) return

    setSearchLoading(true)
    setSearchError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(locationInput.trim())}&limit=1`,
        { headers: { 'User-Agent': 'Leefii/1.0' } }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        const parts = result.display_name.split(', ')
        let city = parts[0] || locationInput
        let state = ''
        for (const part of parts) {
          if (part.length === 2 && part === part.toUpperCase()) {
            state = part
            break
          }
        }
        if (!state && parts.length >= 2) state = parts[parts.length - 2] || ''

        setLocation({
          city,
          state,
          zip: /^\d{5}$/.test(locationInput.trim()) ? locationInput.trim() : undefined,
          lat,
          lng,
        })
        setIsChangerOpen(false)
        setLocationInput('')
        setLoading(true)
      } else {
        setSearchError('Location not found. Try a ZIP code or city name.')
      }
    } catch {
      setSearchError('Failed to search location. Please try again.')
    } finally {
      setSearchLoading(false)
    }
  }

  // Loading skeleton
  if (locationLoading || loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // No location or error or no deals
  if (!location || error || deals.length === 0) return null

  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Deals Near You
          </h2>
          <div className="relative">
            <p className="text-sm text-gray-600">
              Showing deals near{' '}
              <button
                onClick={() => setIsChangerOpen(!isChangerOpen)}
                className="inline-flex items-center gap-1 text-green-700 font-medium hover:text-green-800 underline decoration-dotted underline-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {location.city}, {location.state}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </p>

            {/* Location changer dropdown */}
            {isChangerOpen && (
              <>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                  <form onSubmit={handleLocationSearch}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Change Location
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder="ZIP code or city, state"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        disabled={searchLoading}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={searchLoading || !locationInput.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {searchLoading ? '...' : 'Go'}
                      </button>
                    </div>
                    {searchError && (
                      <p className="mt-2 text-xs text-red-600">{searchError}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Examples: 90210, Miami FL, New York
                    </p>
                  </form>
                </div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsChangerOpen(false)}
                />
              </>
            )}
          </div>
        </div>
        {locationInfo?.stateSlug && (
          <Link
            href={`/deals/${locationInfo.stateSlug}`}
            className="text-green-600 hover:text-green-700 font-medium text-sm whitespace-nowrap"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={`/deals/${deal.slug}`}
            className="group bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-100 hover:border-green-200 p-5 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              {deal.dispensaryName && (
                <span className="text-sm text-green-600 font-medium truncate mr-2">
                  {deal.dispensaryName}
                </span>
              )}
              <DiscountBadge type={deal.discountType} value={deal.discountValue} />
            </div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-1.5 line-clamp-2">
              {deal.title}
            </h3>
            {deal.description && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                {deal.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {deal.isOngoing ? (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Ongoing
                </span>
              ) : deal.endDate ? (
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  Expires{' '}
                  {new Date(deal.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              ) : null}
              {deal.code && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-mono">
                  Code: {deal.code}
                </span>
              )}
              {deal.isFeatured && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
