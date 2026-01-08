/**
 * Tool card component
 * Displays a tool with icon, name, description, and favorite toggle
 */

import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { getIconGradient, getCardGradient } from '../../utils/gradients';
import { cn } from '../../lib/utils';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);
  const Icon = tool.icon;
  const cardGradient = getCardGradient(tool.id);
  const iconGradient = getIconGradient(tool.id);

  return (
    <Link to={tool.path} className="group">
      <div className={`relative h-full rounded-2xl bg-gradient-to-br ${cardGradient} backdrop-blur-2xl border border-white/20 dark:border-border p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-white/40 dark:hover:border-primary/30 hover:-translate-y-1 hover:scale-[1.02] bg-white/30 dark:bg-black/20`}>
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />

        {/* Icon */}
        <div className={`mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${iconGradient} text-white shadow-xl shadow-primary/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/50 backdrop-blur-sm`}>
          <Icon className="h-5 w-5" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="space-y-2 relative z-10">
          <h3 className="font-semibold text-lg tracking-tight leading-tight text-foreground dark:text-white drop-shadow-sm">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(tool.id);
          }}
          className={cn(
            'absolute top-4 right-4 p-2 rounded-xl transition-all duration-300 backdrop-blur-xl z-20',
            isFavorite
              ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/20 border border-yellow-400/40 shadow-lg shadow-yellow-400/20'
              : 'text-muted-foreground dark:text-white/40 hover:text-foreground dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 dark:border-border opacity-0 group-hover:opacity-100 hover:scale-110'
          )}
        >
          <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-2xl pointer-events-none" />
      </div>
    </Link>
  );
}
