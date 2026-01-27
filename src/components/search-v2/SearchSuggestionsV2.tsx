'use client';

import { useEffect, useRef } from 'react';
import { MapPin, Cannabis, Package, Tag, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  SearchSuggestion,
  DispensarySuggestion,
  LocationSuggestion,
  ProductSuggestion,
  StrainSuggestion,
  BrandSuggestion,
  SearchSuggestionsResponse,
} from './types';

interface SearchSuggestionsV2Props {
  suggestions: SearchSuggestionsResponse['suggestions'];
  highlightedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  onHighlight: (index: number) => void;
  isLoading?: boolean;
  query: string;
}

/**
 * Autocomplete dropdown with grouped suggestions
 * Supports keyboard navigation and mouse interaction
 */
export function SearchSuggestionsV2({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
  isLoading,
  query,
}: SearchSuggestionsV2Props) {
  const listRef = useRef<HTMLDivElement>(null);

  // Flatten for index calculation
  const flatSuggestions = [
    ...suggestions.dispensaries,
    ...suggestions.locations,
    ...suggestions.products,
    ...suggestions.strains,
    ...suggestions.brands,
  ];

  const hasResults = flatSuggestions.length > 0;

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlighted = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  // Calculate the global index for each suggestion
  let currentIndex = 0;
  const getIndex = () => currentIndex++;

  return (
    <div
      ref={listRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
      role="listbox"
    >
      {isLoading && (
        <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Searching...
        </div>
      )}

      {!isLoading && !hasResults && query.length >= 2 && (
        <div className="px-4 py-8 text-center">
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {!isLoading && hasResults && (
        <>
          {/* Dispensaries */}
          {suggestions.dispensaries.length > 0 && (
            <SuggestionGroup
              title="Dispensaries"
              icon={<Building2 className="w-4 h-4" />}
            >
              {suggestions.dispensaries.map((suggestion) => {
                const index = getIndex();
                return (
                  <DispensaryItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={highlightedIndex === index}
                    index={index}
                    onSelect={() => onSelect(suggestion)}
                    onMouseEnter={() => onHighlight(index)}
                  />
                );
              })}
            </SuggestionGroup>
          )}

          {/* Locations */}
          {suggestions.locations.length > 0 && (
            <SuggestionGroup
              title="Locations"
              icon={<MapPin className="w-4 h-4" />}
            >
              {suggestions.locations.map((suggestion) => {
                const index = getIndex();
                return (
                  <LocationItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={highlightedIndex === index}
                    index={index}
                    onSelect={() => onSelect(suggestion)}
                    onMouseEnter={() => onHighlight(index)}
                  />
                );
              })}
            </SuggestionGroup>
          )}

          {/* Products */}
          {suggestions.products.length > 0 && (
            <SuggestionGroup
              title="Products"
              icon={<Package className="w-4 h-4" />}
            >
              {suggestions.products.map((suggestion) => {
                const index = getIndex();
                return (
                  <ProductItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={highlightedIndex === index}
                    index={index}
                    onSelect={() => onSelect(suggestion)}
                    onMouseEnter={() => onHighlight(index)}
                  />
                );
              })}
            </SuggestionGroup>
          )}

          {/* Strains */}
          {suggestions.strains.length > 0 && (
            <SuggestionGroup
              title="Strains"
              icon={<Cannabis className="w-4 h-4" />}
            >
              {suggestions.strains.map((suggestion) => {
                const index = getIndex();
                return (
                  <StrainItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={highlightedIndex === index}
                    index={index}
                    onSelect={() => onSelect(suggestion)}
                    onMouseEnter={() => onHighlight(index)}
                  />
                );
              })}
            </SuggestionGroup>
          )}

          {/* Brands */}
          {suggestions.brands.length > 0 && (
            <SuggestionGroup
              title="Brands"
              icon={<Tag className="w-4 h-4" />}
            >
              {suggestions.brands.map((suggestion) => {
                const index = getIndex();
                return (
                  <BrandItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    isHighlighted={highlightedIndex === index}
                    index={index}
                    onSelect={() => onSelect(suggestion)}
                    onMouseEnter={() => onHighlight(index)}
                  />
                );
              })}
            </SuggestionGroup>
          )}
        </>
      )}
    </div>
  );
}

// Group wrapper component
function SuggestionGroup({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// Base item wrapper
function SuggestionItemWrapper({
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
  children,
}: {
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      data-index={index}
      role="option"
      aria-selected={isHighlighted}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        'px-4 py-3 cursor-pointer transition-colors',
        isHighlighted ? 'bg-green-50' : 'hover:bg-gray-50'
      )}
    >
      {children}
    </div>
  );
}

// Dispensary item
function DispensaryItem({
  suggestion,
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
}: {
  suggestion: DispensarySuggestion;
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <SuggestionItemWrapper
      isHighlighted={isHighlighted}
      index={index}
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-green-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {suggestion.city}, {suggestion.state}
          </p>
        </div>
      </div>
    </SuggestionItemWrapper>
  );
}

// Location item
function LocationItem({
  suggestion,
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
}: {
  suggestion: LocationSuggestion;
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <SuggestionItemWrapper
      isHighlighted={isHighlighted}
      index={index}
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {suggestion.name}
            {suggestion.stateCode && suggestion.locationType === 'city' && (
              <span className="text-gray-500">, {suggestion.stateCode}</span>
            )}
          </p>
          {suggestion.dispensaryCount !== undefined && (
            <p className="text-sm text-gray-500">
              {suggestion.dispensaryCount} dispensaries
            </p>
          )}
        </div>
      </div>
    </SuggestionItemWrapper>
  );
}

// Product item
function ProductItem({
  suggestion,
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
}: {
  suggestion: ProductSuggestion;
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <SuggestionItemWrapper
      isHighlighted={isHighlighted}
      index={index}
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-purple-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {suggestion.brand && <span>{suggestion.brand}</span>}
            {suggestion.brand && suggestion.price && <span> · </span>}
            {suggestion.price && <span>${suggestion.price}</span>}
          </p>
        </div>
      </div>
    </SuggestionItemWrapper>
  );
}

// Strain item
function StrainItem({
  suggestion,
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
}: {
  suggestion: StrainSuggestion;
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  const typeColors = {
    SATIVA: 'bg-yellow-100 text-yellow-700',
    INDICA: 'bg-indigo-100 text-indigo-700',
    HYBRID: 'bg-green-100 text-green-700',
    CBD: 'bg-teal-100 text-teal-700',
  };

  return (
    <SuggestionItemWrapper
      isHighlighted={isHighlighted}
      index={index}
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Cannabis className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0',
                typeColors[suggestion.strainType]
              )}
            >
              {suggestion.strainType}
            </span>
          </div>
          {suggestion.thcMax && (
            <p className="text-sm text-gray-500">Up to {suggestion.thcMax}% THC</p>
          )}
        </div>
      </div>
    </SuggestionItemWrapper>
  );
}

// Brand item
function BrandItem({
  suggestion,
  isHighlighted,
  index,
  onSelect,
  onMouseEnter,
}: {
  suggestion: BrandSuggestion;
  isHighlighted: boolean;
  index: number;
  onSelect: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <SuggestionItemWrapper
      isHighlighted={isHighlighted}
      index={index}
      onSelect={onSelect}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Tag className="w-5 h-5 text-orange-600" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
          {suggestion.productCount !== undefined && (
            <p className="text-sm text-gray-500">{suggestion.productCount} products</p>
          )}
        </div>
      </div>
    </SuggestionItemWrapper>
  );
}
