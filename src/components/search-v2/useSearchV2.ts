'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SEARCH_CONFIG } from '@/lib/search/search-config';
import type {
  UseSearchV2Options,
  UseSearchV2Return,
  SearchSuggestion,
  SearchSuggestionsResponse,
} from './types';

/**
 * Custom hook for Search V2 functionality
 * Handles query state, autocomplete, keyboard navigation, voice search, and AI mode
 */
export function useSearchV2(options: UseSearchV2Options = {}): UseSearchV2Return {
  const { initialQuery = '', location, onSelect, autoFocus = false } = options;
  const router = useRouter();

  // Core state
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestionsResponse['suggestions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Voice search state
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // AI mode state
  const [aiModeEnabled, setAiModeEnabled] = useState(false);

  // Refs
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check voice search support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVoiceSupported(
        'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
      );
    }
  }, []);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < SEARCH_CONFIG.minQueryLength) {
      setSuggestions(null);
      setIsOpen(false);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: searchQuery });
      if (location) {
        params.set('lat', location.lat.toString());
        params.set('lng', location.lng.toString());
      }

      const response = await fetch(`/api/v2/search/suggest?${params}`, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data: SearchSuggestionsResponse = await response.json();
      setSuggestions(data.suggestions);
      setIsOpen(true);
      setHighlightedIndex(-1);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Ignore abort errors
        return;
      }
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setSuggestions(null);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  // Debounced query change handler
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, SEARCH_CONFIG.debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Flatten suggestions for keyboard navigation
  const getFlatSuggestions = useCallback((): SearchSuggestion[] => {
    if (!suggestions) return [];
    return [
      ...suggestions.dispensaries,
      ...suggestions.locations,
      ...suggestions.products,
      ...suggestions.strains,
      ...suggestions.brands,
    ];
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const flatSuggestions = getFlatSuggestions();
    const maxIndex = flatSuggestions.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatSuggestions[highlightedIndex]) {
          selectSuggestion(flatSuggestions[highlightedIndex]);
        } else if (query.length >= SEARCH_CONFIG.minQueryLength) {
          // Navigate to search results page
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [getFlatSuggestions, highlightedIndex, query, router]);

  // Select a suggestion
  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    // Track analytics
    if (SEARCH_CONFIG.analytics.trackSuggestionClicks) {
      trackSuggestionClick(query, suggestion);
    }

    if (onSelect) {
      onSelect(suggestion);
    } else {
      // Default navigation based on type
      switch (suggestion.type) {
        case 'dispensary':
          router.push(`/dispensaries/${suggestion.slug}`);
          break;
        case 'location':
          router.push(`/dispensaries/${suggestion.slug}`);
          break;
        case 'product':
          router.push(`/marketplace/products/${suggestion.slug}`);
          break;
        case 'strain':
          router.push(`/strains/${suggestion.slug}`);
          break;
        case 'brand':
          router.push(`/marketplace?brand=${suggestion.slug}`);
          break;
      }
    }

    setIsOpen(false);
    setQuery(suggestion.name);
  }, [query, onSelect, router]);

  // Voice search handlers
  const startVoiceSearch = useCallback(() => {
    if (!voiceSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = SEARCH_CONFIG.voiceSearch.language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [voiceSupported]);

  const stopVoiceSearch = useCallback(() => {
    setIsListening(false);
  }, []);

  // AI mode toggle
  const toggleAiMode = useCallback(() => {
    setAiModeEnabled(prev => !prev);
  }, []);

  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setSuggestions(null);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    selectSuggestion,
    clear,
    voiceSearch: {
      isListening,
      isSupported: voiceSupported,
      start: startVoiceSearch,
      stop: stopVoiceSearch,
    },
    aiMode: {
      isEnabled: aiModeEnabled,
      toggle: toggleAiMode,
    },
  };
}

// Analytics helper (lightweight, fires and forgets)
async function trackSuggestionClick(query: string, suggestion: SearchSuggestion) {
  try {
    await fetch('/api/v2/search/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'suggestion_click',
        query,
        resultType: suggestion.type,
        resultId: suggestion.id,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Fail silently - analytics should never break UX
  }
}
