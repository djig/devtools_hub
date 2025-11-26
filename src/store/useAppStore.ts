import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState } from '../types';

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      recentTools: [],
      favoriteTools: [],

      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(theme);
        }
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      addRecentTool: (toolId) =>
        set((state) => {
          const filtered = state.recentTools.filter((id) => id !== toolId);
          return {
            recentTools: [toolId, ...filtered].slice(0, 10),
          };
        }),

      toggleFavorite: (toolId) =>
        set((state) => {
          const isFavorite = state.favoriteTools.includes(toolId);
          return {
            favoriteTools: isFavorite
              ? state.favoriteTools.filter((id) => id !== toolId)
              : [...state.favoriteTools, toolId],
          };
        }),
    }),
    {
      name: 'devtools-hub-storage',
    }
  )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const { theme } = useAppStore.getState();
  const root = window.document.documentElement;

  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { theme } = useAppStore.getState();
    if (theme === 'system') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    }
  });
}

export default useAppStore;
