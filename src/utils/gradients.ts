/**
 * Gradient utilities for consistent tool styling
 * Provides deterministic gradient selection based on tool ID
 */

import { ICON_GRADIENTS, CARD_GRADIENTS } from '../constants';

/**
 * Generate a hash from a string for consistent gradient selection
 */
function hashString(str: string): number {
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

/**
 * Get a consistent icon gradient based on tool ID
 * @param toolId - The unique identifier of the tool
 * @returns A Tailwind gradient class string
 */
export function getIconGradient(toolId: string): string {
  const hash = hashString(toolId);
  return ICON_GRADIENTS[hash % ICON_GRADIENTS.length];
}

/**
 * Get a consistent card gradient based on tool ID
 * @param toolId - The unique identifier of the tool
 * @returns A Tailwind gradient class string with hover states
 */
export function getCardGradient(toolId: string): string {
  const hash = hashString(toolId);
  return CARD_GRADIENTS[hash % CARD_GRADIENTS.length];
}

/**
 * Spotlight colors that match the icon gradients
 */
const SPOTLIGHT_COLORS = [
  'rgba(59, 130, 246, 0.4)',   // blue
  'rgba(139, 92, 246, 0.4)',   // purple
  'rgba(236, 72, 153, 0.4)',   // pink
  'rgba(245, 158, 11, 0.4)',   // amber
  'rgba(16, 185, 129, 0.4)',   // emerald
  'rgba(6, 182, 212, 0.4)',    // cyan
  'rgba(244, 63, 94, 0.4)',    // rose
  'rgba(99, 102, 241, 0.4)',   // indigo
];

/**
 * Get a consistent spotlight color based on tool ID
 * @param toolId - The unique identifier of the tool
 * @returns An rgba color string for the spotlight
 */
export function getSpotlightColor(toolId: string): string {
  const hash = hashString(toolId);
  return SPOTLIGHT_COLORS[hash % SPOTLIGHT_COLORS.length];
}
