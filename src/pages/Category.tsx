import { Link, useParams } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { getToolsByCategory, getCategoryInfo } from '../data/tools';
import { ChevronRight, Home } from 'lucide-react';
import type { ToolCategory } from '../types';

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = getCategoryInfo(category as ToolCategory);
  const tools = getToolsByCategory(category as ToolCategory);

  if (!categoryInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
        <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
      </div>
    );
  }

  const Icon = categoryInfo.icon;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryInfo.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary inline-flex">
          <Icon className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{categoryInfo.name}</h1>
          <p className="text-lg text-muted-foreground">{categoryInfo.description}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} available
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No tools available in this category yet.</p>
        </div>
      )}
    </div>
  );
}
