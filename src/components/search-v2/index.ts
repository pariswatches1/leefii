/**
 * Search V2 Components
 * Google-style search experience with autocomplete, voice search, and AI mode
 */

// Main components
export { GlobalSearchV2 } from './GlobalSearchV2';
export { SearchInputV2 } from './SearchInputV2';
export { SearchSuggestionsV2 } from './SearchSuggestionsV2';
export { SearchResultsV2 } from './SearchResultsV2';
export { VoiceSearchButton } from './VoiceSearchButton';
export { AIModeToggle } from './AIModeToggle';
export { MobileSearchOverlay } from './MobileSearchOverlay';
export { HeaderSearchV2 } from './HeaderSearchV2';
export { HeroSearchV2 } from './HeroSearchV2';

// Hooks
export { useSearchV2 } from './useSearchV2';

// Types
export type {
  SearchSuggestion,
  DispensarySuggestion,
  LocationSuggestion,
  ProductSuggestion,
  StrainSuggestion,
  BrandSuggestion,
  SearchResultType,
  SearchSuggestionsResponse,
  SearchResultsResponse,
  SearchAnalyticsEvent,
  UseSearchV2Options,
  UseSearchV2Return,
} from './types';
