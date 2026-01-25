'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';

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

function isValidLocation(data: unknown): data is Location {
  if (!data || typeof data !== 'object') return false;
  const loc = data as Record<string, unknown>;
  return (
    typeof loc.city === 'string' &&
    loc.city !== '' &&
    loc.city !== 'Unknown' &&
    typeof loc.lat === 'number' &&
    typeof loc.lng === 'number' &&
    !isNaN(loc.lat) &&
    !isNaN(loc.lng) &&
    loc.lat !== 0 &&
    loc.lng !== 0
  );
}

function getStoredLocation(): Location | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (isValidLocation(parsed)) {
        return parsed;
      }
      // Invalid data - remove it
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage synchronously to avoid flash
  const [location, setLocationState] = useState<Location | null>(() => {
    if (typeof window === 'undefined') return null;
    return getStoredLocation();
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return getStoredLocation() === null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have location from localStorage initialization, we're done
    if (location) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function detectLocation() {
      try {
        const response = await fetch('/api/geolocation', {
          signal: controller.signal
        });

        const data = await response.json();

        if (response.ok && data.city && typeof data.lat === 'number' && typeof data.lng === 'number') {
          const detectedLocation: Location = {
            city: data.city,
            state: data.state || '',
            zip: data.zip,
            lat: data.lat,
            lng: data.lng,
          };

          setLocationState(detectedLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(detectedLocation));
        } else {
          setError('Could not detect location');
        }
      } catch (err) {
        // Don't set error if the fetch was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Could not detect location');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    detectLocation();

    return () => {
      controller.abort();
    };
  }, [location]);

  const setLocation = useCallback((newLocation: Location) => {
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
