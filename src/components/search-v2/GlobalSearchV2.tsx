'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SearchInputV2 } from './SearchInputV2';
import { SearchSuggestionsV2 } from './SearchSuggestionsV2';
import { useSearchV2 } from './useSearchV2';

interface GlobalSearchV2Props {
  /** Initial query value */
  initialQuery?: string;
  /** User's location for boosting local results */
  location?: { lat: number; lng: number };
  /** Size variant */
  size?: 'default' | 'large';
  /** Placeholder text */
  placeholder?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Additional class names */
  className?: string;
  /** Callback when search is submitted */
  onSubmit?: (query: string) => void;
}

/**
 * Google-style global search component
 * Features: autocomplete, voice search, AI mode toggle, keyboard navigation
 */
export function GlobalSearchV2({
  initialQuery = '',
  location,
  size = 'default',
  placeholder,
  autoFocus = false,
  className,
  onSubmit,
}: GlobalSearchV2Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    close,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    selectSuggestion,
    clear,
    voiceSearch,
    aiMode,
  } = useSearchV2({
    initialQuery,
    location,
    autoFocus,
  });

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      close();
      if (onSubmit) {
        onSubmit(query);
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <SearchInputV2
          ref={inputRef}
          value={query}
          onChange={setQuery}
          onFocus={() => {
            if (suggestions && query.length >= 2) {
              // Re-open if we have suggestions
            }
          }}
          onKeyDown={handleKeyDown}
          onClear={clear}
          placeholder={placeholder}
          autoFocus={autoFocus}
          isLoading={isLoading}
          voiceSearch={voiceSearch}
          aiMode={aiMode}
          size={size}
        />
      </form>

      {/* Suggestions dropdown */}
      {isOpen && suggestions && (
        <SearchSuggestionsV2
          suggestions={suggestions}
          highlightedIndex={highlightedIndex}
          onSelect={selectSuggestion}
          onHighlight={setHighlightedIndex}
          isLoading={isLoading}
          query={query}
        />
      )}
    </div>
  );
}
