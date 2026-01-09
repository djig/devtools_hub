/**
 * CategoryToolGrid - iOS Control Center style flexbox wrap layout
 * Tools flow naturally in rows, no fixed grid
 */

import type { Tool } from '../../types';
import { MiniToolButton } from './MiniToolButton';
import { cn } from '../../lib/utils';

interface CategoryToolGridProps {
  tools: Tool[];
  className?: string;
}

export function CategoryToolGrid({ tools, className }: CategoryToolGridProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5',
        className
      )}
    >
      {tools.map((tool, index) => (
        <MiniToolButton
          key={tool.id}
          tool={tool}
          index={index}
        />
      ))}
    </div>
  );
}
