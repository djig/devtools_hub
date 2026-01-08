/**
 * Tests for theme utility functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSystemTheme, applyTheme } from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark');
  });

  describe('getSystemTheme', () => {
    it('returns dark when system prefers dark', () => {
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      } as MediaQueryList);

      expect(getSystemTheme()).toBe('dark');
    });

    it('returns light when system prefers light', () => {
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
      } as MediaQueryList);

      expect(getSystemTheme()).toBe('light');
    });
  });

  describe('applyTheme', () => {
    it('applies dark theme class', () => {
      applyTheme('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.classList.contains('light')).toBe(false);
    });

    it('applies light theme class', () => {
      applyTheme('light');
      expect(document.documentElement.classList.contains('light')).toBe(true);
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('applies system theme based on preference', () => {
      vi.mocked(window.matchMedia).mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
      } as MediaQueryList);

      applyTheme('system');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes previous theme class before applying new one', () => {
      document.documentElement.classList.add('light');
      applyTheme('dark');
      expect(document.documentElement.classList.contains('light')).toBe(false);
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });
});
