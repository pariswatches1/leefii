'use client';

import { useState } from 'react';
import { useLocation } from './LocationDetector';

export default function LocationChanger() {
  const { location, setLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use a geocoding API to convert ZIP/city to coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(input.trim())}&limit=1`,
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
        let city = parts[0] || input;
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
          zip: /^\d{5}$/.test(input.trim()) ? input.trim() : undefined,
          lat,
          lng,
        });

        setIsOpen(false);
        setInput('');
      } else {
        setError('Location not found. Try a ZIP code or city name.');
      }
    } catch {
      setError('Failed to search location. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!location) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-lime-800 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{location.city}, {location.state}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ZIP code or city, state"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-lime-600 text-white rounded-lg text-sm font-medium hover:bg-lime-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : 'Go'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600">{error}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Examples: 90210, Miami FL, New York
            </p>
          </form>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
