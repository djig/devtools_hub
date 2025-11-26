import type { LucideIcon } from 'lucide-react';
import type { LazyExoticComponent, ComponentType } from 'react';

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

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: LucideIcon;
  keywords: string[];
  component: LazyExoticComponent<ComponentType<any>>;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  recentTools: string[];
  favoriteTools: string[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  addRecentTool: (toolId: string) => void;
  toggleFavorite: (toolId: string) => void;
}
