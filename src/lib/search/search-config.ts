/**
 * Search V2 Configuration
 * Feature flags and configuration for the new search experience
 */

// Feature flag - controls whether Search V2 is enabled
// TEMPORARILY HARDCODED TO TRUE for testing
export const SEARCH_V2_ENABLED = true;

// Search configuration
export const SEARCH_CONFIG = {
  // Debounce delay for autocomplete (ms)
  debounceMs: 200,

  // Minimum characters before triggering autocomplete
  minQueryLength: 2,

  // Maximum suggestions per category
  suggestionsLimit: {
    dispensaries: 10,
    locations: 4,
    products: 4,
    strains: 4,
    brands: 3,
  },

  // Results page pagination
  resultsPerPage: 20,

  // Search priority weights (higher = more important)
  priority: {
    dispensaries: 5,
    locations: 4,
    products: 3,
    strains: 2,
    brands: 1,
  },

  // Analytics settings
  analytics: {
    enabled: true,
    trackPopularSearches: true,
    trackZeroResults: true,
    trackSuggestionClicks: true,
  },

  // AI Mode settings (UI only for now)
  aiMode: {
    enabled: false, // Will be enabled when API integration is approved
    budgetPerQuery: 0.01, // $0.01 cap per query
  },

  // Voice search settings
  voiceSearch: {
    enabled: true, // UI enabled, actual functionality depends on browser support
    language: 'en-US',
  },
} as const;

// Type exports
export type SearchCategory = keyof typeof SEARCH_CONFIG.suggestionsLimit;
export type SearchPriority = keyof typeof SEARCH_CONFIG.priority;
