/**
 * Hook for managing theme state
 * Provides theme value, resolved theme, and setter
 */

import { useState, useEffect, useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { getSystemTheme } from '../utils/theme';
import type { Theme } from '../constants';

export interface UseThemeReturn {
  /** Current theme setting ('light', 'dark', or 'system') */
  theme: Theme;
  /** Resolved theme after applying system preference ('light' or 'dark') */
  resolvedTheme: 'light' | 'dark';
  /** Function to update the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark (ignores system) */
  toggleTheme: () => void;
}

/**
 * Hook for theme management with system preference support
 *
 * @example
 * const { theme, resolvedTheme, setTheme } = useTheme();
 *
 * // Check actual applied theme
 * if (resolvedTheme === 'dark') {
 *   // Dark mode is active
 * }
 *
 * // Change theme
 * setTheme('light');
 */
export function useTheme(): UseThemeReturn {
  const { theme, setTheme } = useAppStore();

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return getSystemTheme();
  });

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
