/**
 * Tool Button Variants
 * Different visual styles for tool buttons to create variety across categories
 */

export { GlowPillButton } from './GlowPillButton';
export { IconGridButton } from './IconGridButton';
export { ListRowButton } from './ListRowButton';
export { MiniCardButton } from './MiniCardButton';
export { CompactChipButton } from './CompactChipButton';
export { CircleBadgeButton } from './CircleBadgeButton';
export { StatusBadgeButton } from './StatusBadgeButton';

// Button variant type
export type ToolButtonVariant =
  | 'glow-pill'      // Original glowing pill (Text Tools)
  | 'icon-grid'      // Square icon tiles (Generators, Calculators)
  | 'list-row'       // Full width rows (Developer Tools)
  | 'mini-card'      // Small cards (Converters, Formatters)
  | 'compact-chip'   // Minimal chips (Encoders)
  | 'circle-badge'   // Circular badges (DateTime)
  | 'status-badge';  // Network status style (Network)
