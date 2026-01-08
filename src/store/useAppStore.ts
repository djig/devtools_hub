/**
 * Global application state store
 * Manages theme, sidebar, recent tools, and favorites
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';
import type { Theme } from '../constants';
import { APP_CONFIG, STORAGE_KEYS } from '../constants';
import { applyTheme, initializeTheme } from '../utils/theme';

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'dark',
      sidebarOpen: true,
      recentTools: [],
      favoriteTools: [],

      // Actions
      setTheme: (theme: Theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      addRecentTool: (toolId: string) =>
        set((state) => {
          const filtered = state.recentTools.filter((id) => id !== toolId);
          return {
            recentTools: [toolId, ...filtered].slice(0, APP_CONFIG.MAX_RECENT_TOOLS),
          };
        }),

      toggleFavorite: (toolId: string) =>
        set((state) => ({
          favoriteTools: state.favoriteTools.includes(toolId)
            ? state.favoriteTools.filter((id) => id !== toolId)
            : [...state.favoriteTools, toolId],
        })),
    }),
    {
      name: STORAGE_KEYS.APP_STORE,
      onRehydrateStorage: () => (state) => {
        // Initialize theme after rehydration from localStorage
        if (state) {
          initializeTheme(state.theme, () => {
            // Re-apply theme when system preference changes
            const currentTheme = useAppStore.getState().theme;
            if (currentTheme === 'system') {
              applyTheme('system');
            }
          });
        }
      },
    }
  )
);

// Selectors for optimized component re-renders
export const selectTheme = (state: AppState) => state.theme;
export const selectSidebarOpen = (state: AppState) => state.sidebarOpen;
export const selectRecentTools = (state: AppState) => state.recentTools;
export const selectFavoriteTools = (state: AppState) => state.favoriteTools;

export default useAppStore;
