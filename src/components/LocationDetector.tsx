'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

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

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function detectLocation() {
      // Check localStorage first (skip re-detection if already stored)
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocationState(parsed);
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Use our server-side API for IP geolocation (works in all browsers)
      try {
        const response = await fetch('/api/geolocation');
        const data = await response.json();

        if (response.ok && data.city && data.lat && data.lng) {
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
      } catch {
        setError('Could not detect location');
      } finally {
        setLoading(false);
      }
    }

    detectLocation();
  }, []);

  const setLocation = (newLocation: Location) => {
    setLocationState(newLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
  };

  const clearLocation = () => {
    setLocationState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

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
