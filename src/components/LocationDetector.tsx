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
      // Check localStorage first
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

      // Try browser geolocation first
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 600000, // 10 minutes cache
            });
          });

          const { latitude, longitude } = position.coords;

          // Reverse geocode to get city/state
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geoData = await geoResponse.json();

          const detectedLocation: Location = {
            city: geoData.address?.city || geoData.address?.town || geoData.address?.village || 'Unknown',
            state: geoData.address?.state || '',
            zip: geoData.address?.postcode,
            lat: latitude,
            lng: longitude,
          };

          setLocationState(detectedLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(detectedLocation));
          setLoading(false);
          return;
        } catch {
          // Geolocation failed or denied, fall through to IP-based
        }
      }

      // Fallback to IP-based geolocation
      try {
        const ipResponse = await fetch('https://ip-api.com/json/?fields=city,region,zip,lat,lon');
        const ipData = await ipResponse.json();

        const detectedLocation: Location = {
          city: ipData.city || 'Unknown',
          state: ipData.region || '',
          zip: ipData.zip,
          lat: ipData.lat,
          lng: ipData.lon,
        };

        setLocationState(detectedLocation);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(detectedLocation));
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
