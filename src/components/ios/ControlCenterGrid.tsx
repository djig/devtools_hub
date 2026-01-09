/**
 * Control Center Grid - iOS-style mixed size grid layout
 * Supports square, wide, and large card sizes
 */

import { cn } from '../../lib/utils';

interface ControlCenterGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ControlCenterGrid({ children, className }: ControlCenterGridProps) {
  return (
    <div
      className={cn(
        // Base grid
        'grid',
        // Mobile: 2 columns
        'grid-cols-2',
        // Desktop: 4 columns
        'md:grid-cols-4',
        // Gap
        'gap-3 md:gap-4',
        // Auto rows for consistent sizing
        'auto-rows-fr',
        className
      )}
    >
      {children}
    </div>
  );
}
