'use client';

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceSearchButton } from './VoiceSearchButton';
import { AIModeToggle } from './AIModeToggle';

interface SearchInputV2Props {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
  voiceSearch?: {
    isListening: boolean;
    isSupported: boolean;
    start: () => void;
    stop: () => void;
  };
  aiMode?: {
    isEnabled: boolean;
    toggle: () => void;
  };
  size?: 'default' | 'large';
  className?: string;
}

/**
 * Google-style search input with mic and AI mode icons
 */
export const SearchInputV2 = forwardRef<HTMLInputElement, SearchInputV2Props>(
  function SearchInputV2(
    {
      value,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onClear,
      placeholder = 'Search dispensaries, strains, products...',
      autoFocus = false,
      isLoading = false,
      voiceSearch,
      aiMode,
      size = 'default',
      className,
    },
    ref
  ) {
    const isLarge = size === 'large';

    return (
      <div
        className={cn(
          'relative flex items-center w-full bg-white rounded-full border border-gray-200',
          'shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-green-500',
          'transition-all duration-200',
          isLarge ? 'h-14' : 'h-11',
          className
        )}
      >
        {/* Search icon */}
        <div className={cn('flex-shrink-0 pl-4', isLarge ? 'pl-5' : 'pl-4')}>
          <Search
            className={cn(
              'text-gray-400',
              isLarge ? 'w-5 h-5' : 'w-4 h-4',
              isLoading && 'animate-pulse'
            )}
          />
        </div>

        {/* Input field */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className={cn(
            'flex-1 bg-transparent border-none outline-none px-3',
            'text-gray-900 placeholder:text-gray-400',
            isLarge ? 'text-lg' : 'text-base'
          )}
          aria-label="Search"
          role="combobox"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {/* Right side icons */}
        <div className={cn('flex items-center gap-1 flex-shrink-0', isLarge ? 'pr-3' : 'pr-2')}>
          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* Divider */}
          {(voiceSearch || aiMode) && value && (
            <div className="w-px h-6 bg-gray-200 mx-1" />
          )}

          {/* Voice search button */}
          {voiceSearch && (
            <VoiceSearchButton
              isListening={voiceSearch.isListening}
              isSupported={voiceSearch.isSupported}
              onStart={voiceSearch.start}
              onStop={voiceSearch.stop}
            />
          )}

          {/* AI mode toggle */}
          {aiMode && (
            <AIModeToggle
              isEnabled={aiMode.isEnabled}
              onToggle={aiMode.toggle}
            />
          )}
        </div>
      </div>
    );
  }
);
