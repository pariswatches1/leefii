'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  entityType: 'STRAIN' | 'DISPENSARY' | 'PRODUCT' | 'DEAL' | 'strain' | 'dispensary' | 'product' | 'deal';
  entityId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  isFavorited?: boolean;
}

export default function FavoriteButton({
  entityType: rawEntityType,
  entityId,
  className = '',
  size = 'md',
  showText = false,
  isFavorited: initialIsFavorited,
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  // Normalize entityType to uppercase
  const entityType = rawEntityType.toUpperCase() as 'STRAIN' | 'DISPENSARY' | 'PRODUCT' | 'DEAL';
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited ?? false);
  const [isLoading, setIsLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  // Check if already favorited on mount (only if not provided as prop)
  useEffect(() => {
    if (initialIsFavorited === undefined && status === 'authenticated' && session?.user?.id) {
      checkFavoriteStatus();
    }
  }, [status, session?.user?.id, entityId, initialIsFavorited]);

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/check?type=${entityType}&ids=${entityId}`);
      const data = await res.json();
      setIsFavorited(data.favorited?.includes(entityId));
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'authenticated') {
      router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove favorite
        const res = await fetch(`/api/favorites?type=${entityType}&id=${entityId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add favorite
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entityType, entityId }),
        });
        if (res.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`
        ${showText ? 'px-4 py-2 rounded-lg' : `${sizeClasses[size]} rounded-full`}
        flex items-center justify-center gap-2
        transition-all duration-200
        ${isFavorited
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {showText && (
        <span className="text-sm font-medium">
          {isFavorited ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
