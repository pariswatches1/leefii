'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/components/LocationDetector';

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

export default function DeliveryPage() {
  const { location, loading: locationLoading } = useLocation();
  const [dispensaries, setDispensaries] = useState<Dispensary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locationLoading) return;

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      setLoading(false);
      setError('Unable to detect your location. Please enable location services or try again.');
      return;
    }

    let cancelled = false;
    const lat = location.lat;
    const lng = location.lng;

    async function fetchDeliveryDispensaries() {
      try {
        const response = await fetch(
          `/api/dispensaries/nearby?lat=${lat}&lng=${lng}&limit=50&radius=50&delivery=true`
        );

        if (cancelled) return;

        const data = await response.json();

        if (response.ok && data.dispensaries) {
          // Filter to only show dispensaries with delivery
          const deliveryDispensaries = data.dispensaries.filter(
            (d: Dispensary) => d.hasDelivery
          );
          setDispensaries(deliveryDispensaries);
          setError(null);
        } else {
          setError(data.error || 'Failed to load dispensaries');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load delivery dispensaries');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDeliveryDispensaries();

    return () => {
      cancelled = true;
    };
  }, [location, locationLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-orange-300/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/30">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-600/20">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <span className="text-3xl font-extrabold text-white">Leefii</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dispensaries" className="text-white/80 hover:text-white transition font-medium">
                  Dispensaries
                </Link>
                <Link href="/delivery" className="text-white font-medium border-b-2 border-white pb-1">
                  Delivery
                </Link>
                <Link href="/doctors" className="text-white/80 hover:text-white transition font-medium">
                  Doctors
                </Link>
                <Link href="/strains" className="text-white/80 hover:text-white transition font-medium">
                  Strains
                </Link>
                <Link href="/deals" className="text-white/80 hover:text-white transition font-medium">
                  Deals
                </Link>
                <Link href="/login" className="px-5 py-2 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Cannabis Delivery
          </h1>
          {location && (
            <p className="text-xl text-white/80">
              Dispensaries that deliver to {location.city}, {location.state} {location.zip && `(${location.zip})`}
            </p>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Get Cannabis Delivered</h3>
              <p className="text-white/70">
                Browse dispensaries that offer delivery to your area. Delivery times and fees vary by dispensary.
                Must be 21+ with valid ID.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(locationLoading || loading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 animate-pulse">
                <div className="h-6 bg-white/30 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-white/30 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 backdrop-blur rounded-2xl p-6 border border-red-300/30 text-center">
            <p className="text-white text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && dispensaries.length === 0 && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-8 border border-white/30 text-center">
            <p className="text-white text-lg mb-2">No delivery dispensaries found in your area.</p>
            <p className="text-white/70 mb-4">Try checking nearby cities or browse all dispensaries.</p>
            <Link
              href="/dispensaries"
              className="inline-block px-6 py-2 bg-white text-orange-600 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              View All Dispensaries
            </Link>
          </div>
        )}

        {/* Dispensaries Grid */}
        {!loading && !error && dispensaries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dispensaries.map((dispensary) => (
              <Link
                key={dispensary.id}
                href={`/dispensary/${dispensary.slug}`}
                className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {dispensary.imageUrl ? (
                      <img
                        src={dispensary.imageUrl}
                        alt={dispensary.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    ) : (
                      <span className="text-3xl">🏪</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-yellow-200 transition">
                      {dispensary.name}
                    </h3>
                    <p className="text-sm text-white/70 truncate mt-1">
                      {dispensary.address}
                    </p>
                    <p className="text-sm text-white/70">
                      {dispensary.city}, {dispensary.state}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
                  {dispensary.rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-sm text-white">
                      <span className="text-yellow-300">★</span>
                      {dispensary.rating.toFixed(1)}
                    </span>
                  )}
                  <span className="text-sm text-white font-medium">
                    {dispensary.distance} mi away
                  </span>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-xs bg-green-500/30 text-green-100 px-3 py-1 rounded-full">
                    🚗 Delivery
                  </span>
                  {dispensary.hasStorefront && (
                    <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                      Storefront
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8 mt-12">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-6 border border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
              </div>
              <span className="font-semibold text-white">Leefii</span>
            </div>
            <div className="flex gap-6 text-sm text-white/70">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
            </div>
            <div className="text-sm text-white/60">
              © 2026 Leefii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
