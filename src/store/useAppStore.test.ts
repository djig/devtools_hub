/**
 * Tests for useAppStore Zustand store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useAppStore from './useAppStore';
import { APP_CONFIG } from '../constants';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    act(() => {
      useAppStore.setState({
        theme: 'dark',
        sidebarOpen: true,
        recentTools: [],
        favoriteTools: [],
      });
    });
  });

  describe('theme', () => {
    it('has default theme of dark', () => {
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('setTheme updates theme', () => {
      act(() => {
        useAppStore.getState().setTheme('light');
      });
      expect(useAppStore.getState().theme).toBe('light');
    });

    it('setTheme accepts system theme', () => {
      act(() => {
        useAppStore.getState().setTheme('system');
      });
      expect(useAppStore.getState().theme).toBe('system');
    });
  });

  describe('sidebar', () => {
    it('has default sidebarOpen of true', () => {
      expect(useAppStore.getState().sidebarOpen).toBe(true);
    });

    it('toggleSidebar toggles sidebar state', () => {
      act(() => {
        useAppStore.getState().toggleSidebar();
      });
      expect(useAppStore.getState().sidebarOpen).toBe(false);

      act(() => {
        useAppStore.getState().toggleSidebar();
      });
      expect(useAppStore.getState().sidebarOpen).toBe(true);
    });
  });

  describe('recentTools', () => {
    it('has empty recentTools by default', () => {
      expect(useAppStore.getState().recentTools).toEqual([]);
    });

    it('addRecentTool adds tool to front of list', () => {
      act(() => {
        useAppStore.getState().addRecentTool('json-formatter');
      });
      expect(useAppStore.getState().recentTools[0]).toBe('json-formatter');
    });

    it('addRecentTool moves existing tool to front', () => {
      act(() => {
        useAppStore.getState().addRecentTool('tool-1');
        useAppStore.getState().addRecentTool('tool-2');
        useAppStore.getState().addRecentTool('tool-1');
      });
      expect(useAppStore.getState().recentTools[0]).toBe('tool-1');
      expect(useAppStore.getState().recentTools[1]).toBe('tool-2');
      expect(useAppStore.getState().recentTools.length).toBe(2);
    });

    it('addRecentTool limits list to MAX_RECENT_TOOLS', () => {
      act(() => {
        for (let i = 0; i < 15; i++) {
          useAppStore.getState().addRecentTool(`tool-${i}`);
        }
      });
      expect(useAppStore.getState().recentTools.length).toBe(
        APP_CONFIG.MAX_RECENT_TOOLS
      );
    });
  });

  describe('favoriteTools', () => {
    it('has empty favoriteTools by default', () => {
      expect(useAppStore.getState().favoriteTools).toEqual([]);
    });

    it('toggleFavorite adds tool to favorites', () => {
      act(() => {
        useAppStore.getState().toggleFavorite('json-formatter');
      });
      expect(useAppStore.getState().favoriteTools).toContain('json-formatter');
    });

    it('toggleFavorite removes tool from favorites', () => {
      act(() => {
        useAppStore.getState().toggleFavorite('json-formatter');
        useAppStore.getState().toggleFavorite('json-formatter');
      });
      expect(useAppStore.getState().favoriteTools).not.toContain('json-formatter');
    });

    it('toggleFavorite handles multiple tools', () => {
      act(() => {
        useAppStore.getState().toggleFavorite('tool-1');
        useAppStore.getState().toggleFavorite('tool-2');
        useAppStore.getState().toggleFavorite('tool-3');
      });
      expect(useAppStore.getState().favoriteTools).toEqual([
        'tool-1',
        'tool-2',
        'tool-3',
      ]);
    });
  });
});
