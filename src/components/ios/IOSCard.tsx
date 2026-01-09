/**
 * iOS Card - Wrapper component for Control Center grid items
 * Applies size-based grid spanning (square, wide, large)
 */

import { cn } from '../../lib/utils';

export type IOSCardSize = 'square' | 'wide' | 'large';

interface IOSCardProps {
  size?: IOSCardSize;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<IOSCardSize, string> = {
  square: 'col-span-1 row-span-1',
  wide: 'col-span-2 row-span-1',
  large: 'col-span-2 row-span-2',
};

export function IOSCard({ size = 'square', children, className }: IOSCardProps) {
  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  );
}

/**
 * Helper function to determine card size based on index
 * Creates a visually interesting mixed layout
 */
// eslint-disable-next-line react-refresh/only-export-components
export function getCardSize(index: number, _total: number): IOSCardSize {
  // First card is large (spans 2x2)
  if (index === 0) return 'large';

  // Every 3rd card starting from index 1 is wide
  if ((index - 1) % 3 === 0) return 'wide';

  // Rest are square
  return 'square';
}

/**
 * Helper function for tool cards - simpler pattern
 * First and every 4th tool is wide, rest are square
 */
// eslint-disable-next-line react-refresh/only-export-components
export function getToolCardSize(index: number): 'square' | 'wide' {
  if (index === 0) return 'wide';
  if ((index + 1) % 4 === 0) return 'wide';
  return 'square';
}
