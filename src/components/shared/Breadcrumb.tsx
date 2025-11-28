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
