'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface NearbyDoctor {
  id: string
  name: string
  slug: string
  businessName: string | null
  city: string | null
  state: string | null
  rating: number
  reviewsCount: number
  telemedicine: boolean
  isFeatured: boolean
  services: string[]
  specialties: string[]
  phone: string | null
  logo: string | null
  distance: number
}

interface NearbyResponse {
  doctors: NearbyDoctor[]
  total: number
  location: {
    lat: number
    lng: number
    city: string | null
    state: string | null
    stateName: string | null
    stateSlug: string | null
  }
}

export default function NearbyDoctors() {
  const [data, setData] = useState<NearbyResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/doctors/nearby')
      .then((res) => {
        if (!res.ok) throw new Error('Location not available')
        return res.json()
      })
      .then((json: NearbyResponse) => {
        if (json.doctors && json.doctors.length > 0) {
          setData(json)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (!loading && !data) return null

  const locationLabel = data?.location
    ? [data.location.city, data.location.stateName || data.location.state].filter(Boolean).join(', ')
    : ''

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Doctors Near You
      </h2>
      {locationLabel && (
        <p className="text-white/60 text-sm mb-4">Based on your location in {locationLabel}</p>
      )}
      {!locationLabel && !loading && (
        <p className="text-white/60 text-sm mb-4">Sorted by distance from your location</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/15 rounded w-1/2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-6 bg-white/10 rounded-full w-16" />
                <div className="h-6 bg-white/10 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.doctors.map((doctor) => (
              <Link
                key={doctor.id}
                href={`/doctors/${doctor.slug}`}
                className="bg-white/15 backdrop-blur rounded-2xl p-6 border border-white/20 hover:bg-white/25 hover:border-white/40 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {doctor.logo ? (
                      <img src={doctor.logo} alt={doctor.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white truncate group-hover:text-yellow-200 transition">
                        {doctor.name}
                      </h3>
                      {doctor.isFeatured && (
                        <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    {doctor.businessName && (
                      <p className="text-sm text-white/60 truncate mt-0.5">{doctor.businessName}</p>
                    )}
                    <p className="text-sm text-white/70 truncate mt-1">
                      {[doctor.city, doctor.state].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Services + Distance */}
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded-full font-medium">
                    {doctor.distance} mi away
                  </span>
                  {doctor.telemedicine && (
                    <span className="text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded-full">
                      Telehealth
                    </span>
                  )}
                  {doctor.services &&
                    doctor.services.slice(0, 2).map((service, i) => (
                      <span key={i} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  {doctor.rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-white">
                      <span className="text-yellow-300">&#9733;</span>
                      {doctor.rating.toFixed(1)}
                      {doctor.reviewsCount > 0 && (
                        <span className="text-white/50">({doctor.reviewsCount})</span>
                      )}
                    </span>
                  )}
                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <span className="text-xs text-white/60">
                      {doctor.specialties.slice(0, 2).join(' \u00b7 ')}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {data.location.stateSlug && (
            <div className="mt-4 text-center">
              <Link
                href={`/doctors/${data.location.stateSlug}`}
                className="text-white/70 hover:text-white text-sm font-medium transition inline-flex items-center gap-1"
              >
                View all doctors in {data.location.stateName || data.location.state}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
