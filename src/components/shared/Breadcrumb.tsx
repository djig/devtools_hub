import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCategoryInfo, getToolByPath } from '../../data/tools';
import type { ToolCategory } from '../../types';

export function Breadcrumb() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Check if this is a category page
  if (pathParts[0] === 'category' && pathParts[1]) {
    const categoryId = pathParts[1] as ToolCategory;
    const categoryInfo = getCategoryInfo(categoryId);

    if (!categoryInfo) return null;

    return (
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="h-3 w-3" />
          <span className="text-[11px]">Home</span>
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[11px] text-foreground font-medium">{categoryInfo.name}</span>
      </nav>
    );
  }

  // Check if this is a tool page
  const tool = getToolByPath(location.pathname);

  if (!tool) return null;

  const categoryInfo = getCategoryInfo(tool.category);

  if (!categoryInfo) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3 w-3" />
        <span className="text-[11px]">Home</span>
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link
        to={`/category/${tool.category}`}
        className="text-[11px] hover:text-foreground transition-colors"
      >
        {categoryInfo.name}
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-[11px] text-foreground font-medium">{tool.name}</span>
    </nav>
  );
}
