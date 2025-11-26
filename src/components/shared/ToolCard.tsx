import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);
  const Icon = tool.icon;

  return (
    <Link to={tool.path} className="group">
      <div className="relative h-full rounded-xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5">
        {/* Icon */}
        <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg tracking-tight leading-tight">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
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
            'absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200',
            isFavorite
              ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-500/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100'
          )}
        >
          <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>

        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl pointer-events-none" />
      </div>
    </Link>
  );
}
