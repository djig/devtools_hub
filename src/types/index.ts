import type { LucideIcon } from 'lucide-react';
import type { LazyExoticComponent, ComponentType } from 'react';
import type { Theme } from '../constants';

export type ToolCategory =
  | 'formatters'
  | 'converters'
  | 'encoders'
  | 'text'
  | 'generators'
  | 'datetime'
  | 'calculators'
  | 'developer'
  | 'network';

/**
 * Props type for tool page components
 * Extend this if tools need common props
 */
export type ToolPageProps = Record<string, never>;

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: LucideIcon;
  keywords: string[];
  component: LazyExoticComponent<ComponentType<ToolPageProps>>;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface AppState {
  // State
  theme: Theme;
  sidebarOpen: boolean;
  recentTools: string[];
  favoriteTools: string[];

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  addRecentTool: (toolId: string) => void;
  toggleFavorite: (toolId: string) => void;
}

// Re-export Theme type for convenience
export type { Theme } from '../constants';
