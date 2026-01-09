import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getToolByPath } from '../../data/tools';

export function Breadcrumb() {
  const location = useLocation();

  // Check if this is a tool page
  const tool = getToolByPath(location.pathname);

  if (!tool) return null;

  // Simplified breadcrumb: Home > Tool Name
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3 w-3" />
        <span className="text-[11px]">Home</span>
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-[11px] text-foreground font-medium">{tool.name}</span>
    </nav>
  );
}
