'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from './LocationDetector';

interface Dispensary {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string | null;
  hasDelivery: boolean;
  hasStorefront: boolean;
  distance: number;
}

export default function NearbyDispensaries() {
  const { location, loading: locationLoading, setLocation } = useLocation();
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Location changer state
  const [isChangerOpen, setIsChangerOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if still loading location
    if (locationLoading) {
      return;
    }

    // No location available - stop loading
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const lat = location.lat;
    const lng = location.lng;

    async function fetchNearby() {

      try {
        const response = await fetch(
          `/api/dispensaries/nearby?lat=${lat}&lng=${lng}&limit=6`
        );

        if (cancelled) return;

        const data = await response.json();

        if (response.ok && data.dispensaries) {
          setDispensaries(data.dispensaries);
          setError(null);
        } else {
          setError(data.error || 'Failed to load');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load nearby dispensaries');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNearby();

    return () => {
      cancelled = true;
    };
  }, [location, locationLoading]);

  async function handleLocationSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!locationInput.trim()) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(locationInput.trim())}&limit=1`,
        {
          headers: {
            'User-Agent': 'Leefii/1.0'
          }
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Parse display name to get city and state
        const parts = result.display_name.split(', ');
        let city = parts[0] || locationInput;
        let state = '';

        // Try to find state abbreviation
        for (const part of parts) {
          if (part.length === 2 && part === part.toUpperCase()) {
            state = part;
            break;
          }
        }

        // If no state abbreviation found, try to find state name
        if (!state && parts.length >= 2) {
          state = parts[parts.length - 2] || '';
        }

        setLocation({
          city,
          state,
          zip: /^\d{5}$/.test(locationInput.trim()) ? locationInput.trim() : undefined,
          lat,
          lng,
        });

        setIsChangerOpen(false);
        setLocationInput('');
        setLoading(true); // Trigger refetch of dispensaries
      } else {
        setSearchError('Location not found. Try a ZIP code or city name.');
      }
    } catch {
      setSearchError('Failed to search location. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }

  // Show loading skeleton while location is loading or dispensaries are loading
  if (locationLoading || loading) {
    return (
      <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
        <div className="animate-pulse">
          <div className="h-6 bg-white/50 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No location detected
  if (!location) {
    return null;
  }

  // Error or no dispensaries found
  if (error || dispensaries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Dispensaries Near You
          </h2>
          <div className="relative">
            <p className="text-sm text-gray-700">
              Showing results near{' '}
              <button
                onClick={() => setIsChangerOpen(!isChangerOpen)}
                className="inline-flex items-center gap-1 text-lime-800 font-medium hover:text-lime-900 underline decoration-dotted underline-offset-2"
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                        disabled={searchLoading}
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={searchLoading || !locationInput.trim()}
                        className="px-3 py-2 bg-lime-600 text-white rounded-lg text-sm font-medium hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsChangerOpen(false)}
                />
              </>
            )}
          </div>
        </div>
        <Link
          href={`/dispensaries?lat=${location.lat}&lng=${location.lng}`}
          className="text-lime-800 hover:text-lime-900 font-medium text-sm"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dispensaries.map((dispensary) => (
          <Link
            key={dispensary.id}
            href={`/dispensary/${dispensary.slug}`}
            className="bg-white/50 hover:bg-white/70 rounded-xl p-4 transition group"
          >
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {dispensary.imageUrl ? (
                  <img
                    src={dispensary.imageUrl}
                    alt={dispensary.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-2xl">🏪</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-lime-800 transition">
                  {dispensary.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {dispensary.city}, {dispensary.state}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {dispensary.rating > 0 && (
                    <span className="text-sm text-gray-700">
                      ⭐ {dispensary.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-sm text-lime-700 font-medium">
                    {dispensary.distance} mi
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {dispensary.hasDelivery && (
                <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded-full">
                  Delivery
                </span>
              )}
              {dispensary.hasStorefront && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Storefront
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
