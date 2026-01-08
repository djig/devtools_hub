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
