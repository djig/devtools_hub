/**
 * CategoryToolGrid - Renders tools with different visual styles
 * Each category can have a unique button variant for visual variety
 */

import type { Tool } from '../../types';
import { cn } from '../../lib/utils';
import {
  GlowPillButton,
  IconGridButton,
  ListRowButton,
  MiniCardButton,
  CompactChipButton,
  CircleBadgeButton,
  StatusBadgeButton,
  type ToolButtonVariant,
} from './tool-buttons';

interface CategoryToolGridProps {
  tools: Tool[];
  variant?: ToolButtonVariant;
  className?: string;
}

// Layout configurations for each variant
const variantLayouts: Record<ToolButtonVariant, string> = {
  'glow-pill': 'flex flex-wrap gap-2',
  'icon-grid': 'grid grid-cols-4 gap-3 justify-items-center',
  'list-row': 'flex flex-col gap-0.5',
  'mini-card': 'grid grid-cols-2 gap-2',
  'compact-chip': 'flex flex-col gap-1',
  'circle-badge': 'flex flex-wrap gap-4 justify-center',
  'status-badge': 'flex flex-col gap-1.5',
};

export function CategoryToolGrid({
  tools,
  variant = 'glow-pill',
  className,
}: CategoryToolGridProps) {
  const layoutClass = variantLayouts[variant];

  const renderButton = (tool: Tool, index: number) => {
    switch (variant) {
      case 'icon-grid':
        return <IconGridButton key={tool.id} tool={tool} index={index} />;
      case 'list-row':
        return <ListRowButton key={tool.id} tool={tool} index={index} />;
      case 'mini-card':
        return <MiniCardButton key={tool.id} tool={tool} index={index} />;
      case 'compact-chip':
        return <CompactChipButton key={tool.id} tool={tool} index={index} />;
      case 'circle-badge':
        return <CircleBadgeButton key={tool.id} tool={tool} index={index} />;
      case 'status-badge':
        return <StatusBadgeButton key={tool.id} tool={tool} index={index} />;
      case 'glow-pill':
      default:
        return <GlowPillButton key={tool.id} tool={tool} index={index} />;
    }
  };

  return (
    <div className={cn(layoutClass, className)}>
      {tools.map((tool, index) => renderButton(tool, index))}
    </div>
  );
}
