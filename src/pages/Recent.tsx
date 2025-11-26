import { Link } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { tools } from '../data/tools';
import { ChevronRight, Home, Clock } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function Recent() {
  const { recentTools } = useAppStore();
  const recentToolsList = tools.filter(tool => recentTools.includes(tool.id));

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Recent</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary inline-flex">
          <Clock className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Recent Tools</h1>
          <p className="text-lg text-muted-foreground">Tools you've recently used</p>
          <p className="text-sm text-muted-foreground mt-2">
            Last {recentToolsList.length} {recentToolsList.length === 1 ? 'tool' : 'tools'} accessed
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      {recentToolsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentToolsList.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex p-6 rounded-full bg-muted/50 text-muted-foreground mb-6">
            <Clock className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <p className="text-lg text-muted-foreground mb-2">No recent tools</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Tools you use will appear here for quick access
          </p>
        </div>
      )}
    </div>
  );
}
