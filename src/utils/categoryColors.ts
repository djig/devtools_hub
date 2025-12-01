import type { ToolCategory } from '../types';

export interface CategoryColors {
  iconBg: string;
  iconText: string;
  badge: string;
  gradientFrom: string;
  gradientTo: string;
}

/**
 * Category color schemes matching the home page and category pages
 * These colors are used consistently across the application
 */
export const categoryColors: Record<ToolCategory, CategoryColors> = {
  formatters: {
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    iconText: 'text-blue-500',
    badge: 'from-blue-400 to-cyan-400',
    gradientFrom: 'from-blue-500/10',
    gradientTo: 'to-cyan-500/5',
  },
  converters: {
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
    iconText: 'text-purple-500',
    badge: 'from-purple-400 to-pink-400',
    gradientFrom: 'from-purple-500/10',
    gradientTo: 'to-pink-500/5',
  },
  encoders: {
    iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
    iconText: 'text-green-500',
    badge: 'from-green-400 to-emerald-400',
    gradientFrom: 'from-green-500/10',
    gradientTo: 'to-emerald-500/5',
  },
  text: {
    iconBg: 'bg-gradient-to-br from-orange-500 to-amber-500',
    iconText: 'text-orange-500',
    badge: 'from-orange-400 to-amber-400',
    gradientFrom: 'from-orange-500/10',
    gradientTo: 'to-amber-500/5',
  },
  generators: {
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-500',
    iconText: 'text-pink-500',
    badge: 'from-pink-400 to-rose-400',
    gradientFrom: 'from-pink-500/10',
    gradientTo: 'to-rose-500/5',
  },
  datetime: {
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    iconText: 'text-indigo-500',
    badge: 'from-indigo-400 to-violet-400',
    gradientFrom: 'from-indigo-500/10',
    gradientTo: 'to-violet-500/5',
  },
  calculators: {
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    iconText: 'text-teal-500',
    badge: 'from-teal-400 to-cyan-400',
    gradientFrom: 'from-teal-500/10',
    gradientTo: 'to-cyan-500/5',
  },
  developer: {
    iconBg: 'bg-gradient-to-br from-red-500 to-orange-500',
    iconText: 'text-red-500',
    badge: 'from-red-400 to-orange-400',
    gradientFrom: 'from-red-500/10',
    gradientTo: 'to-orange-500/5',
  },
  network: {
    iconBg: 'bg-gradient-to-br from-lime-500 to-green-500',
    iconText: 'text-lime-500',
    badge: 'from-lime-400 to-green-400',
    gradientFrom: 'from-lime-500/10',
    gradientTo: 'to-green-500/5',
  },
};

/**
 * Get colors for a specific category
 */
export function getCategoryColors(category: ToolCategory): CategoryColors {
  return categoryColors[category] || categoryColors.formatters;
}
