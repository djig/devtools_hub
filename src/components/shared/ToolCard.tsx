import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface ToolCardProps {
  tool: Tool;
}

// Generate a random gradient for each tool based on its ID
const getToolGradient = (toolId: string): string => {
  const gradients = [
    'from-blue-500/20 to-cyan-500/10 hover:from-blue-500/30 hover:to-cyan-500/20',
    'from-purple-500/20 to-pink-500/10 hover:from-purple-500/30 hover:to-pink-500/20',
    'from-green-500/20 to-emerald-500/10 hover:from-green-500/30 hover:to-emerald-500/20',
    'from-orange-500/20 to-amber-500/10 hover:from-orange-500/30 hover:to-amber-500/20',
    'from-pink-500/20 to-rose-500/10 hover:from-pink-500/30 hover:to-rose-500/20',
    'from-indigo-500/20 to-violet-500/10 hover:from-indigo-500/30 hover:to-violet-500/20',
    'from-teal-500/20 to-cyan-500/10 hover:from-teal-500/30 hover:to-cyan-500/20',
    'from-red-500/20 to-orange-500/10 hover:from-red-500/30 hover:to-orange-500/20',
  ];
  const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const getIconGradient = (toolId: string): string => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-violet-500',
    'from-teal-500 to-cyan-500',
    'from-red-500 to-orange-500',
  ];
  const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export function ToolCard({ tool }: ToolCardProps) {
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);
  const Icon = tool.icon;
  const cardGradient = getToolGradient(tool.id);
  const iconGradient = getIconGradient(tool.id);

  return (
    <Link to={tool.path} className="group">
      <div className={`relative h-full rounded-xl bg-gradient-to-br ${cardGradient} backdrop-blur-sm border border-white/10 p-5 transition-all duration-300 hover:shadow-xl hover:border-white/20 hover:-translate-y-0.5`}>
        {/* Icon */}
        <div className={`mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${iconGradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg tracking-tight leading-tight text-white">
            {tool.name}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
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
            'absolute top-4 right-4 p-1.5 rounded-lg transition-all duration-200 backdrop-blur-sm',
            isFavorite
              ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/20 border border-yellow-400/30'
              : 'text-white/40 hover:text-white hover:bg-white/10 border border-white/10 opacity-0 group-hover:opacity-100'
          )}
        >
          <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </button>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl pointer-events-none" />
      </div>
    </Link>
  );
}
