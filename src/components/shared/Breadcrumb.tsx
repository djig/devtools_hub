import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getCategoryInfo, getToolByPath } from '../../data/tools';

export function Breadcrumb() {
  const location = useLocation();
  const tool = getToolByPath(location.pathname);

  // If we can't find the tool, don't render the breadcrumb
  if (!tool) return null;

  const categoryInfo = getCategoryInfo(tool.category);

  // If we can't find the category, don't render the breadcrumb
  if (!categoryInfo) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        to={`/category/${tool.category}`}
        className="hover:text-foreground transition-colors"
      >
        {categoryInfo.name}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{tool.name}</span>
    </nav>
  );
}
