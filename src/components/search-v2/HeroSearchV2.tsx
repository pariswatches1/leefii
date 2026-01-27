'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic, Sparkles } from 'lucide-react';
import { SearchDropdown, getFlatSuggestions } from './SearchDropdown';
import { SEARCH_CONFIG } from '@/lib/search/search-config';
import type { SearchSuggestionsResponse, SearchResultType } from './types';

interface HeroSearchV2Props {
  className?: string;
}

/**
 * Hero section search component for homepage
 * Google-style layout: clean search bar with icons on right, buttons below
 * Features: Voice search, AI mode, autocomplete dropdown with grouped results
 */
export function HeroSearchV2({ className }: HeroSearchV2Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestionsResponse['suggestions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check for voice search support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
      setVoiceSupported(supported);
    }
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < SEARCH_CONFIG.minQueryLength) {
      setSuggestions(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/v2/search/suggest?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data: SearchSuggestionsResponse = await response.json();
        setSuggestions(data.suggestions);
        setIsOpen(true);
        setHighlightedIndex(-1);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= SEARCH_CONFIG.minQueryLength) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, SEARCH_CONFIG.debounceMs);
    } else {
      setSuggestions(null);
      setIsOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, fetchSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || !suggestions) {
      if (e.key === 'Enter') {
        return; // Let form submit naturally
      }
      return;
    }

    const flatItems = getFlatSuggestions(suggestions);
    const totalItems = flatItems.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case 'Enter':
        if (highlightedIndex >= 0 && highlightedIndex < totalItems) {
          e.preventDefault();
          const selected = flatItems[highlightedIndex];
          handleSelectSuggestion(selected.type, selected.item.slug, selected.item.name);
        }
        // If no item highlighted, let form submit naturally
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex]);

  // Navigate to selected suggestion
  const handleSelectSuggestion = (type: SearchResultType, slug: string, name: string) => {
    setIsOpen(false);
    setQuery(name);

    // Track analytics (fire and forget)
    fetch('/api/v2/search/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'suggestion_click',
        query,
        resultType: type,
        resultId: slug,
      }),
    }).catch(() => {});

    // Navigate based on type
    switch (type) {
      case 'dispensary':
        router.push(`/dispensary/${slug}`);
        break;
      case 'location':
        router.push(`/dispensaries/${slug}`);
        break;
      case 'strain':
        router.push(`/strains/${slug}`);
        break;
      case 'product':
        router.push(`/marketplace/product/${slug}`);
        break;
      case 'brand':
        router.push(`/marketplace?brand=${encodeURIComponent(name)}`);
        break;
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (!voiceSupported) return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleAiMode = () => setAiMode(!aiMode);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);

    const searchParams = new URLSearchParams();
    searchParams.set('q', query.trim());
    if (aiMode) {
      searchParams.set('ai', '1');
    }
    router.push(`/search?${searchParams.toString()}`);
  };

  // Handle "I'm Feeling Lucky"
  const handleFeelingLucky = () => {
    if (!query.trim()) return;
    setIsOpen(false);

    const searchParams = new URLSearchParams();
    searchParams.set('q', query.trim());
    searchParams.set('lucky', '1');
    if (aiMode) {
      searchParams.set('ai', '1');
    }
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className={className} ref={containerRef}>
      {/* Google-style search bar */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className={`
            flex items-center bg-white rounded-full px-5 py-3
            border border-gray-200 hover:shadow-md focus-within:shadow-md
            transition-shadow duration-200
            ${aiMode ? 'ring-2 ring-lime-500 ring-offset-2' : ''}
            ${isOpen && suggestions ? 'rounded-b-none border-b-0 shadow-md' : ''}
          `}>
            {/* Search icon on left */}
            <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (suggestions && query.length >= SEARCH_CONFIG.minQueryLength) {
                  setIsOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={aiMode ? "Describe what you're looking for..." : "Search dispensaries, strains, products..."}
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-base"
              autoComplete="off"
            />

            {/* Divider before icons */}
            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* Voice Search Button */}
            {voiceSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Voice search'}
                title={isListening ? 'Click to stop' : 'Search by voice'}
              >
                <Mic className="w-5 h-5" />
              </button>
            )}

            {/* AI Mode Toggle */}
            <button
              type="button"
              onClick={toggleAiMode}
              className={`
                ml-1 px-3 py-1.5 rounded-full transition-all duration-200
                flex items-center gap-1.5 text-sm font-medium
                border
                ${aiMode
                  ? 'bg-lime-50 text-lime-700 border-lime-300'
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700 border-gray-200'
                }
              `}
              aria-label={aiMode ? 'AI mode on' : 'AI mode off'}
              title={aiMode ? 'AI search enabled' : 'Enable AI search'}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Mode</span>
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && suggestions && (
            <SearchDropdown
              suggestions={suggestions}
              query={query}
              highlightedIndex={highlightedIndex}
              onSelect={handleSelectSuggestion}
              onMouseEnter={setHighlightedIndex}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Buttons below - Google style */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="submit"
            className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
          >
            Leefii Search
          </button>
          <button
            type="button"
            onClick={handleFeelingLucky}
            className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
          >
            I&apos;m Feeling Lucky
          </button>
        </div>
      </form>

      {/* AI Mode hint */}
      {aiMode && (
        <div className="mt-4 text-center text-sm text-lime-700">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Try: &quot;something for pain relief&quot; or &quot;uplifting strain for a party&quot;
        </div>
      )}
    </div>
  );
}
