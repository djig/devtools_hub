import { useParams } from 'react-router-dom';
import { ToolCard } from '../components/shared/ToolCard';
import { getToolsByCategory, getCategoryInfo } from '../data/tools';
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{categoryInfo.name}</h1>
          <p className="text-muted-foreground mt-1">{categoryInfo.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {tools.length === 0 && (
        <p className="text-center py-8 text-muted-foreground">
          No tools available in this category yet.
        </p>
      )}
    </div>
  );
}
