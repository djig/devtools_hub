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
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Favorites</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 text-yellow-600 dark:text-yellow-500 inline-flex">
          <Star className="h-12 w-12" strokeWidth={1.5} fill="currentColor" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Favorite Tools</h1>
          <p className="text-lg text-muted-foreground">Quick access to your most used tools</p>
          <p className="text-sm text-muted-foreground mt-2">
            {favoriteToolsList.length} {favoriteToolsList.length === 1 ? 'tool' : 'tools'} favorited
          </p>
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
