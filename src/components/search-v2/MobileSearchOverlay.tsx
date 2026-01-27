'use client';

import { useEffect, useRef } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchInputV2 } from './SearchInputV2';
import { SearchSuggestionsV2 } from './SearchSuggestionsV2';
import { useSearchV2 } from './useSearchV2';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  location?: { lat: number; lng: number };
}

/**
 * Full-screen mobile search overlay
 * Appears when user taps search on mobile devices
 */
export function MobileSearchOverlay({ isOpen, onClose, location }: MobileSearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen: suggestionsOpen,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    selectSuggestion,
    clear,
    voiceSearch,
    aiMode,
  } = useSearchV2({ location });

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure animation has started
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle suggestion selection - close overlay after
  const handleSelect = (suggestion: any) => {
    selectSuggestion(suggestion);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-white',
        'animate-in slide-in-from-bottom duration-200'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close search"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex-1">
          <SearchInputV2
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              } else {
                handleKeyDown(e);
              }
            }}
            onClear={clear}
            placeholder="Search Leefii..."
            voiceSearch={voiceSearch}
            aiMode={aiMode}
          />
        </div>

        {query && (
          <button
            onClick={() => {
              clear();
              inputRef.current?.focus();
            }}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {suggestionsOpen && suggestions && (
          <div className="py-2">
            <SearchSuggestionsV2
              suggestions={suggestions}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelect}
              onHighlight={setHighlightedIndex}
              isLoading={isLoading}
              query={query}
            />
          </div>
        )}

        {/* Empty state */}
        {!query && (
          <div className="px-4 py-8">
            <p className="text-sm text-gray-500 mb-4">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {['Dispensaries near me', 'Sativa strains', 'CBD products', 'Edibles'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Voice search active state */}
        {voiceSearch.isListening && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-red-500" />
            </div>
            <p className="mt-4 text-gray-600">Listening...</p>
            <button
              onClick={voiceSearch.stop}
              className="mt-4 px-4 py-2 text-sm text-red-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
