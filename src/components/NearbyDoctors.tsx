'use client';

import { useState, useEffect } from 'react';
import { useLocation } from './LocationDetector';

interface Doctor {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  isOpen: boolean | null;
  photoRef: string | null;
  distance: number;
  status: string;
}

export default function NearbyDoctors() {
  const { location, loading: locationLoading } = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (locationLoading) return;

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const lat = location.lat;
    const lng = location.lng;

    async function fetchDoctors() {
      try {
        const response = await fetch(
          `/api/doctors/nearby?lat=${lat}&lng=${lng}&radius=80000`
        );

        if (cancelled) return;

        const data = await response.json();

        if (response.ok && data.doctors) {
          setDoctors(data.doctors.slice(0, 6));
          setError(null);
        } else {
          setError(data.error || 'Failed to load');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load nearby doctors');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, [location, locationLoading]);

  if (locationLoading || loading) {
    return (
      <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
        <div className="animate-pulse">
          <div className="h-6 bg-white/50 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!location) return null;
  if (error || doctors.length === 0) return null;

  return (
    <div className="bg-white/30 backdrop-blur rounded-2xl p-6 border border-white/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Medical Marijuana Card Doctors
          </h2>
          <p className="text-sm text-gray-700">
            Get your MMJ card near {location.city}, {location.state}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <a
            key={doctor.id}
            href={`https://www.google.com/maps/place/?q=place_id:${doctor.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/50 hover:bg-white/70 rounded-xl p-4 transition group"
          >
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-700 transition text-sm">
                  {doctor.name}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {doctor.address}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {doctor.rating > 0 && (
                    <span className="text-xs text-gray-700">
                      ⭐ {doctor.rating.toFixed(1)} ({doctor.reviewsCount})
                    </span>
                  )}
                  <span className="text-xs text-blue-700 font-medium">
                    {doctor.distance} mi
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {doctor.isOpen !== null && (
                <span className={`text-xs px-2 py-1 rounded-full ${doctor.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {doctor.isOpen ? 'Open Now' : 'Closed'}
                </span>
              )}
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                MMJ Card
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
