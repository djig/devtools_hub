import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
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
    <Link to={tool.path}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 relative group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base mb-1">{tool.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(tool.id);
              }}
              className={cn(
                'p-1 rounded transition-colors',
                isFavorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100'
              )}
            >
              <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </button>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
