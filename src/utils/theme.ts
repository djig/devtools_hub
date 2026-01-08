/**
 * Theme utilities for managing light/dark mode
 * Provides centralized theme management with system preference support
 */

import type { Theme } from '../constants';

/**
 * Get the current system theme preference
 * @returns 'dark' if system prefers dark mode, 'light' otherwise
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply a theme to the document
 * @param theme - The theme to apply ('light', 'dark', or 'system')
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  root.classList.add(effectiveTheme);
}

/**
 * Initialize theme and set up system preference listener
 * @param theme - The initial theme setting
 * @param onSystemChange - Optional callback when system theme changes (only called if theme is 'system')
 * @returns Cleanup function to remove event listener
 */
export function initializeTheme(
  theme: Theme,
  onSystemChange?: () => void
): () => void {
  applyTheme(theme);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = () => {
    if (theme === 'system') {
      applyTheme('system');
      onSystemChange?.();
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}
