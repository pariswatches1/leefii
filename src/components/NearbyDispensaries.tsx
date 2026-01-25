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
  const { location, loading: locationLoading } = useLocation();
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    async function fetchNearby() {
      const lat = location.lat;
      const lng = location.lng;

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
          <p className="text-sm text-gray-700">
            Showing results near {location.city}, {location.state}
          </p>
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
