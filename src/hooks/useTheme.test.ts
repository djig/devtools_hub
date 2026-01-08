import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock the store
const mockSetTheme = vi.fn();
vi.mock('../store/useAppStore', () => ({
  default: vi.fn(() => ({
    theme: 'system',
    setTheme: mockSetTheme,
    recentTools: [],
    favoriteTools: [],
    searchHistory: [],
    addToRecent: vi.fn(),
    toggleFavorite: vi.fn(),
    addToSearchHistory: vi.fn(),
    clearSearchHistory: vi.fn(),
  })),
}));

// Mock getSystemTheme
vi.mock('../utils/theme', () => ({
  getSystemTheme: vi.fn(() => 'dark'),
}));

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns theme from store', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('provides setTheme function', () => {
    const { result } = renderHook(() => useTheme());
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('provides toggleTheme function', () => {
    const { result } = renderHook(() => useTheme());
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('resolves system theme when theme is system', () => {
    const { result } = renderHook(() => useTheme());
    // System theme is mocked to return 'dark'
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('has correct return type', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('resolvedTheme');
    expect(result.current).toHaveProperty('setTheme');
    expect(result.current).toHaveProperty('toggleTheme');
  });
});
