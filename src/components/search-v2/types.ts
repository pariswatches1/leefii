/**
 * Search V2 Types
 */

export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  type: SearchResultType;
  subtitle?: string;
  imageUrl?: string;
}

export interface DispensarySuggestion extends SearchSuggestion {
  type: 'dispensary';
  city: string;
  state: string;
  address?: string;
}

export interface LocationSuggestion extends SearchSuggestion {
  type: 'location';
  locationType: 'city' | 'state';
  state?: string;
  stateCode?: string;
  dispensaryCount?: number;
}

export interface ProductSuggestion extends SearchSuggestion {
  type: 'product';
  price?: number;
  brand?: string;
  sellerName?: string;
}

export interface StrainSuggestion extends SearchSuggestion {
  type: 'strain';
  strainType: 'SATIVA' | 'INDICA' | 'HYBRID' | 'CBD';
  thcMax?: number;
}

export interface BrandSuggestion extends SearchSuggestion {
  type: 'brand';
  productCount?: number;
}

export type SearchResultType = 'dispensary' | 'location' | 'product' | 'strain' | 'brand';

export interface SearchSuggestionsResponse {
  query: string;
  suggestions: {
    dispensaries: DispensarySuggestion[];
    locations: LocationSuggestion[];
    products: ProductSuggestion[];
    strains: StrainSuggestion[];
    brands: BrandSuggestion[];
  };
  location?: {
    lat: number;
    lng: number;
    city?: string;
    state?: string;
  };
}

export interface SearchResultsResponse {
  query: string;
  type: SearchResultType | 'all';
  results: SearchSuggestion[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  facets: {
    dispensaries: number;
    locations: number;
    products: number;
    strains: number;
    brands: number;
  };
}

export interface SearchAnalyticsEvent {
  type: 'search' | 'suggestion_click' | 'zero_results';
  query: string;
  resultType?: SearchResultType;
  resultId?: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface UseSearchV2Options {
  /** Initial query value */
  initialQuery?: string;
  /** User's location for local results */
  location?: { lat: number; lng: number };
  /** Callback when suggestion is selected */
  onSelect?: (suggestion: SearchSuggestion) => void;
  /** Auto-focus input on mount */
  autoFocus?: boolean;
}

export interface UseSearchV2Return {
  /** Current query value */
  query: string;
  /** Set query value */
  setQuery: (query: string) => void;
  /** Suggestions grouped by type */
  suggestions: SearchSuggestionsResponse['suggestions'] | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether suggestions dropdown is open */
  isOpen: boolean;
  /** Open suggestions dropdown */
  open: () => void;
  /** Close suggestions dropdown */
  close: () => void;
  /** Currently highlighted suggestion index */
  highlightedIndex: number;
  /** Set highlighted index */
  setHighlightedIndex: (index: number) => void;
  /** Handle keyboard navigation */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Select a suggestion */
  selectSuggestion: (suggestion: SearchSuggestion) => void;
  /** Clear the search */
  clear: () => void;
  /** Voice search state */
  voiceSearch: {
    isListening: boolean;
    isSupported: boolean;
    start: () => void;
    stop: () => void;
  };
  /** AI mode state */
  aiMode: {
    isEnabled: boolean;
    toggle: () => void;
  };
}
