'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocation } from '@/components/LocationDetector'

interface NearbyDispensary {
  id: string
  name: string
  slug: string
  address: string
  city: string
  state: string
  rating: number
  reviewsCount: number
  imageUrl: string | null
  hasDelivery: boolean
  hasStorefront: boolean
  distance: number
}

export default function NearMeClient({ popularZipCodes }: { popularZipCodes: { zipCode: string; cityName: string; stateAbbr: string; count: number }[] }) {
  const { location, loading: locationLoading } = useLocation()
  const [dispensaries, setDispensaries] = useState<NearbyDispensary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zipInput, setZipInput] = useState('')
  const [searched, setSearched] = useState(false)

  // Auto-fetch nearby dispensaries when location is detected
  useEffect(() => {
    if (location && !searched) {
      fetchNearby(location.lat, location.lng)
    }
  }, [location, searched])

  async function fetchNearby(lat: number, lng: number) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/dispensaries/nearby?lat=${lat}&lng=${lng}&radius=25&limit=20`)
      const data = await res.json()
      if (data.dispensaries) {
        setDispensaries(data.dispensaries)
      } else {
        setError('No dispensaries found nearby.')
      }
    } catch {
      setError('Failed to fetch nearby dispensaries. Please try searching by zip code.')
    } finally {
      setLoading(false)
    }
  }

  function handleZipSearch(e: React.FormEvent) {
    e.preventDefault()
    const zip = zipInput.trim()
    if (/^\d{5}$/.test(zip)) {
      window.location.href = `/near-me/${zip}`
    }
  }

  return (
    <div>
      {/* Search Box */}
      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Search by Zip Code</h2>
        <p className="text-gray-600 mb-4">Enter your zip code to find dispensaries near you.</p>
        <form onSubmit={handleZipSearch} className="flex gap-3">
          <input
            type="text"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Enter zip code (e.g., 90210)"
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg"
            maxLength={5}
            inputMode="numeric"
            pattern="[0-9]{5}"
          />
          <button
            type="submit"
            disabled={zipInput.length !== 5}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>
      </div>

      {/* Auto-detected Results */}
      {locationLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Detecting your location...</p>
        </div>
      )}

      {loading && !locationLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding dispensaries near you...</p>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-center">
          <p className="text-yellow-800">{error}</p>
          <p className="text-yellow-600 text-sm mt-2">Try searching by zip code above or browse popular areas below.</p>
        </div>
      )}

      {!loading && !locationLoading && dispensaries.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dispensaries Near {location?.city ? `${location.city}, ${location.state}` : 'You'}
          </h2>
          <p className="text-gray-600 mb-6">Showing {dispensaries.length} dispensaries within 25 miles of your location.</p>
          <div className="grid gap-4">
            {dispensaries.map((d) => (
              <Link key={d.id} href={`/dispensary/${d.slug}`} className="bg-white rounded-xl border p-5 hover:shadow-md hover:border-green-500 transition flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{d.name}</h3>
                  <p className="text-sm text-gray-500">{d.address} · {d.city}, {d.state}</p>
                  <div className="flex gap-2 mt-2">
                    {d.hasDelivery && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Delivery</span>}
                    {d.hasStorefront && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">Storefront</span>}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-semibold text-green-700">{d.distance} mi</div>
                  {d.rating > 0 && (
                    <div className="text-sm text-gray-500">{Number(d.rating).toFixed(1)} ★ ({d.reviewsCount})</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Zip Codes */}
      {popularZipCodes.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Areas</h2>
          <p className="text-gray-600 mb-6">Browse dispensaries in these popular zip codes.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularZipCodes.map((z) => (
              <Link key={z.zipCode} href={`/near-me/${z.zipCode}`} className="bg-white rounded-xl border p-4 hover:shadow-md hover:border-green-500 transition text-center">
                <p className="font-bold text-gray-900 text-lg">{z.zipCode}</p>
                <p className="text-sm text-gray-600">{z.cityName}, {z.stateAbbr}</p>
                <p className="text-xs text-gray-400 mt-1">{z.count} dispensaries</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
