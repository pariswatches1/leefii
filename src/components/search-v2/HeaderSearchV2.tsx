'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlobalSearchV2 } from './GlobalSearchV2';
import { MobileSearchOverlay } from './MobileSearchOverlay';

interface HeaderSearchV2Props {
  className?: string;
}

/**
 * Header search component for Search V2
 * Collapsible on desktop, triggers full-screen overlay on mobile
 */
export function HeaderSearchV2({ className }: HeaderSearchV2Props) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOverlayOpen, setIsMobileOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user location (respects existing location detection)
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Location denied or unavailable - that's fine
        }
      );
    }
  }, []);

  const handleSearchClick = () => {
    if (isMobile) {
      setIsMobileOverlayOpen(true);
    } else {
      setIsExpanded(true);
    }
  };

  const handleSearchSubmit = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsExpanded(false);
  };

  // Collapsed state - just the icon
  if (!isExpanded) {
    return (
      <>
        <button
          onClick={handleSearchClick}
          className={cn(
            'p-2 text-gray-500 hover:text-green-600 transition rounded-full hover:bg-gray-100',
            className
          )}
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Mobile overlay */}
        <MobileSearchOverlay
          isOpen={isMobileOverlayOpen}
          onClose={() => setIsMobileOverlayOpen(false)}
          location={userLocation}
        />
      </>
    );
  }

  // Expanded state - full search box (desktop only)
  return (
    <>
      <div
        className={cn(
          'relative flex items-center',
          'animate-in fade-in slide-in-from-right-4 duration-200',
          className
        )}
      >
        <div className="w-64 lg:w-80">
          <GlobalSearchV2
            autoFocus
            location={userLocation}
            onSubmit={handleSearchSubmit}
            placeholder="Search..."
          />
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition"
          aria-label="Close search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsExpanded(false)}
      />
    </>
  );
}
