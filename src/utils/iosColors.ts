/**
 * iOS System Colors utility
 * Maps gradient colors to iOS system colors for consistent styling
 */

// iOS System Color Palette
export const iosColors = {
  blue: '#007AFF',
  green: '#30D158',
  purple: '#BF5AF2',
  orange: '#FF9F0A',
  pink: '#FF375F',
  teal: '#64D2FF',
  red: '#FF453A',
  indigo: '#5E5CE6',
  yellow: '#FFD60A',
  gray: '#8E8E93',
  mint: '#00C7BE',
  cyan: '#32ADE6',
} as const;

/**
 * Get iOS system color based on gradient string
 */
export function getIOSColor(gradient: string): string {
  if (gradient.includes('blue') || gradient.includes('cyan')) return iosColors.blue;
  if (gradient.includes('green') || gradient.includes('emerald')) return iosColors.green;
  if (gradient.includes('purple') || gradient.includes('violet')) return iosColors.purple;
  if (gradient.includes('orange') || gradient.includes('amber')) return iosColors.orange;
  if (gradient.includes('pink') || gradient.includes('rose')) return iosColors.pink;
  if (gradient.includes('teal')) return iosColors.teal;
  if (gradient.includes('red')) return iosColors.red;
  if (gradient.includes('indigo')) return iosColors.indigo;
  if (gradient.includes('lime')) return iosColors.green;
  if (gradient.includes('yellow')) return iosColors.yellow;
  if (gradient.includes('fuchsia')) return iosColors.pink;
  if (gradient.includes('slate') || gradient.includes('gray') || gradient.includes('zinc')) return iosColors.gray;
  return iosColors.blue;
}

/**
 * Get a slightly darker version of iOS color for shadows
 */
export function getIOSColorDark(color: string): string {
  return `${color}cc`;
}

/**
 * Get a lighter version of iOS color for backgrounds
 */
export function getIOSColorLight(color: string, opacity: number = 0.2): string {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
}
