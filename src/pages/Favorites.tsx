import { Link } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { tools } from '../data/tools';
import { ChevronRight, Home, Star } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function Favorites() {
  const { favoriteTools } = useAppStore();
  const favoriteToolsList = tools.filter(tool => favoriteTools.includes(tool.id));

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/60">
        <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-white font-medium">Favorites</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white shadow-2xl inline-flex">
          <Star className="h-14 w-14" strokeWidth={2} fill="currentColor" />
        </div>
        <div className="flex-1">
          <h1 className="text-5xl font-bold tracking-tight mb-3 text-white">Favorite Tools</h1>
          <p className="text-lg text-white/70 mb-3">Quick access to your most used tools</p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-400/10 border border-white/10">
            <span className="text-sm font-medium bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              {favoriteToolsList.length} {favoriteToolsList.length === 1 ? 'tool' : 'tools'} favorited
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      {favoriteToolsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteToolsList.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 rounded-full bg-muted/50 text-muted-foreground mb-6">
            <Star className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-lg text-muted-foreground mb-2">No favorite tools yet</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click the star icon on any tool card to add it to your favorites for quick access
          </p>
        </div>
      )}
    </div>
  );
}
