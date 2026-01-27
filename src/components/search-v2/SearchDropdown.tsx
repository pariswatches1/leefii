'use client';

import { MapPin, Store, Leaf, Package, Tag, TrendingUp } from 'lucide-react';
import type {
  SearchSuggestionsResponse,
  DispensarySuggestion,
  LocationSuggestion,
  ProductSuggestion,
  StrainSuggestion,
  BrandSuggestion,
  SearchResultType,
} from './types';

interface SearchDropdownProps {
  suggestions: SearchSuggestionsResponse['suggestions'];
  query: string;
  highlightedIndex: number;
  onSelect: (type: SearchResultType, slug: string, name: string) => void;
  onMouseEnter: (index: number) => void;
  isLoading?: boolean;
}

// Get flat list of all suggestions for keyboard navigation
export function getFlatSuggestions(suggestions: SearchSuggestionsResponse['suggestions']) {
  const items: { type: SearchResultType; item: any; globalIndex: number }[] = [];
  let index = 0;

  suggestions.dispensaries.forEach((item) => {
    items.push({ type: 'dispensary', item, globalIndex: index++ });
  });
  suggestions.locations.forEach((item) => {
    items.push({ type: 'location', item, globalIndex: index++ });
  });
  suggestions.strains.forEach((item) => {
    items.push({ type: 'strain', item, globalIndex: index++ });
  });
  suggestions.products.forEach((item) => {
    items.push({ type: 'product', item, globalIndex: index++ });
  });
  suggestions.brands.forEach((item) => {
    items.push({ type: 'brand', item, globalIndex: index++ });
  });

  return items;
}

export function SearchDropdown({
  suggestions,
  query,
  highlightedIndex,
  onSelect,
  onMouseEnter,
  isLoading,
}: SearchDropdownProps) {
  const hasResults =
    suggestions.dispensaries.length > 0 ||
    suggestions.locations.length > 0 ||
    suggestions.strains.length > 0 ||
    suggestions.products.length > 0 ||
    suggestions.brands.length > 0;

  if (isLoading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
        <div className="p-4 text-center text-gray-500">
          <div className="animate-pulse">Searching...</div>
        </div>
      </div>
    );
  }

  if (!hasResults && query.length >= 2) {
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50">
        <div className="p-4 text-center text-gray-500">
          No results found for &quot;{query}&quot;
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return null;
  }

  let currentIndex = 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
      {/* Dispensaries */}
      {suggestions.dispensaries.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            Dispensaries
          </div>
          {suggestions.dispensaries.map((item) => {
            const itemIndex = currentIndex++;
            return (
              <DispensaryItem
                key={item.id}
                item={item}
                isHighlighted={highlightedIndex === itemIndex}
                onSelect={() => onSelect('dispensary', item.slug, item.name)}
                onMouseEnter={() => onMouseEnter(itemIndex)}
                query={query}
              />
            );
          })}
        </div>
      )}

      {/* Locations */}
      {suggestions.locations.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Locations
          </div>
          {suggestions.locations.map((item) => {
            const itemIndex = currentIndex++;
            return (
              <LocationItem
                key={item.id}
                item={item}
                isHighlighted={highlightedIndex === itemIndex}
                onSelect={() => onSelect('location', item.slug, item.name)}
                onMouseEnter={() => onMouseEnter(itemIndex)}
                query={query}
              />
            );
          })}
        </div>
      )}

      {/* Strains */}
      {suggestions.strains.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5" />
            Strains
          </div>
          {suggestions.strains.map((item) => {
            const itemIndex = currentIndex++;
            return (
              <StrainItem
                key={item.id}
                item={item}
                isHighlighted={highlightedIndex === itemIndex}
                onSelect={() => onSelect('strain', item.slug, item.name)}
                onMouseEnter={() => onMouseEnter(itemIndex)}
                query={query}
              />
            );
          })}
        </div>
      )}

      {/* Products */}
      {suggestions.products.length > 0 && (
        <div className="border-b border-gray-100">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 flex items-center gap-2">
            <Package className="w-3.5 h-3.5" />
            Products
          </div>
          {suggestions.products.map((item) => {
            const itemIndex = currentIndex++;
            return (
              <ProductItem
                key={item.id}
                item={item}
                isHighlighted={highlightedIndex === itemIndex}
                onSelect={() => onSelect('product', item.slug, item.name)}
                onMouseEnter={() => onMouseEnter(itemIndex)}
                query={query}
              />
            );
          })}
        </div>
      )}

      {/* Brands */}
      {suggestions.brands.length > 0 && (
        <div>
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" />
            Brands
          </div>
          {suggestions.brands.map((item) => {
            const itemIndex = currentIndex++;
            return (
              <BrandItem
                key={item.id}
                item={item}
                isHighlighted={highlightedIndex === itemIndex}
                onSelect={() => onSelect('brand', item.slug, item.name)}
                onMouseEnter={() => onMouseEnter(itemIndex)}
                query={query}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// Highlight matching text
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="font-semibold text-lime-700">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Individual item components
function DispensaryItem({
  item,
  isHighlighted,
  onSelect,
  onMouseEnter,
  query,
}: {
  item: DispensarySuggestion;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  query: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
        isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-8 h-8 bg-lime-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Store className="w-4 h-4 text-lime-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          <HighlightedText text={item.name} query={query} />
        </div>
        <div className="text-xs text-gray-500 truncate">
          {item.subtitle ? (
            <span className="text-lime-600 font-medium">{item.subtitle}</span>
          ) : (
            <span>{item.city}, {item.state}</span>
          )}
          {item.subtitle && <span className="mx-1">·</span>}
          {item.subtitle && <span>{item.city}, {item.state}</span>}
        </div>
      </div>
    </button>
  );
}

function LocationItem({
  item,
  isHighlighted,
  onSelect,
  onMouseEnter,
  query,
}: {
  item: LocationSuggestion;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  query: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
        isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <MapPin className="w-4 h-4 text-blue-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          <HighlightedText text={item.name} query={query} />
          {item.stateCode && item.locationType === 'city' && (
            <span className="text-gray-500">, {item.stateCode}</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {item.dispensaryCount} dispensaries
        </div>
      </div>
    </button>
  );
}

function StrainItem({
  item,
  isHighlighted,
  onSelect,
  onMouseEnter,
  query,
}: {
  item: StrainSuggestion;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  query: string;
}) {
  const typeColors: Record<string, string> = {
    SATIVA: 'bg-orange-100 text-orange-700',
    INDICA: 'bg-purple-100 text-purple-700',
    HYBRID: 'bg-green-100 text-green-700',
    CBD: 'bg-blue-100 text-blue-700',
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
        isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Leaf className="w-4 h-4 text-green-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          <HighlightedText text={item.name} query={query} />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-1.5 py-0.5 rounded ${typeColors[item.strainType] || 'bg-gray-100 text-gray-700'}`}>
            {item.strainType}
          </span>
          {item.thcMax && <span className="text-gray-500">THC {item.thcMax}%</span>}
        </div>
      </div>
    </button>
  );
}

function ProductItem({
  item,
  isHighlighted,
  onSelect,
  onMouseEnter,
  query,
}: {
  item: ProductSuggestion;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  query: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
        isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Package className="w-4 h-4 text-amber-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          <HighlightedText text={item.name} query={query} />
        </div>
        <div className="text-xs text-gray-500 truncate">
          {item.brand && <span>{item.brand} · </span>}
          {item.price && <span className="font-medium text-lime-700">${item.price}</span>}
        </div>
      </div>
    </button>
  );
}

function BrandItem({
  item,
  isHighlighted,
  onSelect,
  onMouseEnter,
  query,
}: {
  item: BrandSuggestion;
  isHighlighted: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
  query: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
        isHighlighted ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Tag className="w-4 h-4 text-pink-700" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          <HighlightedText text={item.name} query={query} />
        </div>
        {item.productCount && (
          <div className="text-xs text-gray-500">
            {item.productCount} products
          </div>
        )}
      </div>
    </button>
  );
}
