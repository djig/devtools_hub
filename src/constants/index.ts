/**
 * Application-wide constants
 * Centralized configuration to eliminate magic numbers and duplicate values
 */

// Application configuration
export const APP_CONFIG = {
  MAX_RECENT_TOOLS: 10,
  MAX_SEARCH_RESULTS: 8,
  MAX_FAVORITES_DISPLAY: 5,
  COPY_TIMEOUT_MS: 2000,
  DEBOUNCE_DELAY_MS: 500,
} as const;

// Storage keys for localStorage
export const STORAGE_KEYS = {
  APP_STORE: 'devtools-hub-storage',
} as const;

// Icon gradients for tool icons (solid gradients)
export const ICON_GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-violet-500',
  'from-teal-500 to-cyan-500',
  'from-red-500 to-orange-500',
] as const;

// Card gradients for tool cards (semi-transparent with hover states)
export const CARD_GRADIENTS = [
  'from-blue-500/20 to-cyan-500/10 hover:from-blue-500/30 hover:to-cyan-500/20',
  'from-purple-500/20 to-pink-500/10 hover:from-purple-500/30 hover:to-pink-500/20',
  'from-green-500/20 to-emerald-500/10 hover:from-green-500/30 hover:to-emerald-500/20',
  'from-orange-500/20 to-amber-500/10 hover:from-orange-500/30 hover:to-amber-500/20',
  'from-pink-500/20 to-rose-500/10 hover:from-pink-500/30 hover:to-rose-500/20',
  'from-indigo-500/20 to-violet-500/10 hover:from-indigo-500/30 hover:to-violet-500/20',
  'from-teal-500/20 to-cyan-500/10 hover:from-teal-500/30 hover:to-cyan-500/20',
  'from-red-500/20 to-orange-500/10 hover:from-red-500/30 hover:to-orange-500/20',
] as const;

// Type exports for type safety
export type IconGradient = (typeof ICON_GRADIENTS)[number];
export type CardGradient = (typeof CARD_GRADIENTS)[number];
export type Theme = 'light' | 'dark' | 'system';
