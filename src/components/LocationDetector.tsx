'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback, useRef } from 'react';

interface Location {
  city: string;
  state: string;
  zip?: string;
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: Location | null;
  loading: boolean;
  error: string | null;
  setLocation: (location: Location) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'leefii_location';

function getStoredLocation(): Location | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed.city === 'string' && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
        return parsed;
      }
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track initialization - survives React Strict Mode remounts
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    // Track mounted state for async cleanup
    mountedRef.current = true;

    // Prevent duplicate initialization (handles Strict Mode double-mount)
    if (initializingRef.current) return;
    initializingRef.current = true;

    async function detectLocation() {
      // Check localStorage first (synchronous)
      const stored = getStoredLocation();
      if (stored) {
        if (mountedRef.current) {
          setLocationState(stored);
          setLoading(false);
        }
        return;
      }

      // Fetch from API
      try {
        const response = await fetch('/api/geolocation');

        // Check if still mounted before updating state
        if (!mountedRef.current) return;

        const data = await response.json();

        if (response.ok && data.city && typeof data.lat === 'number' && typeof data.lng === 'number') {
          const detectedLocation: Location = {
            city: data.city,
            state: data.state || '',
            zip: data.zip,
            lat: data.lat,
            lng: data.lng,
          };

          if (mountedRef.current) {
            setLocationState(detectedLocation);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(detectedLocation));
          }
        } else if (mountedRef.current) {
          setError('Could not detect location');
        }
      } catch {
        if (mountedRef.current) {
          setError('Could not detect location');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }

    detectLocation();

    // Cleanup function for Strict Mode unmount
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setLocation = useCallback((newLocation: Location) => {
    // Validate that the location has required numeric coordinates
    if (typeof newLocation.lat !== 'number' || typeof newLocation.lng !== 'number' ||
        isNaN(newLocation.lat) || isNaN(newLocation.lng)) {
      console.error('Invalid location: lat and lng must be valid numbers', newLocation);
      return;
    }
    setLocationState(newLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
  }, []);

  const clearLocation = useCallback(() => {
    setLocationState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, error, setLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
