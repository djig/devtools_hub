import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, ChevronDown, ChevronRight, Home, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { categories, tools } from '../../data/tools';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import type { ToolCategory } from '../../types';

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, recentTools, favoriteTools } = useAppStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['recent', 'favorites'])
  );
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggleCollapse = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const recentToolsList = tools.filter((tool) => recentTools.includes(tool.id));
  const favoriteToolsList = tools.filter((tool) => favoriteTools.includes(tool.id));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const getCategoryTools = (categoryId: ToolCategory) => {
    return tools.filter((tool) => tool.category === categoryId);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 220 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const effectiveWidth = isCollapsed ? 60 : sidebarWidth;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-r border-white/20 dark:border-border/40 shadow-lg',
          'bg-white/70 dark:bg-background/80 backdrop-blur-xl',
          'transition-all duration-300 ease-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ width: window.innerWidth >= 1024 ? `${effectiveWidth}px` : '280px' }}
      >
        <div className="flex h-full flex-col relative">
          {/* Glass shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Collapse Button */}
          <div className="hidden lg:flex items-center justify-between p-3 border-b">
            {!isCollapsed && <span className="font-semibold text-sm">Navigation</span>}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleCollapse}
              className="ml-auto"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
            {!isCollapsed ? (
              <div className="space-y-2">
                {/* Home Link */}
                <Link
                  to="/"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                    location.pathname === '/' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <span className="truncate font-medium">Home</span>
                </Link>

              {/* Favorites Section */}
              {favoriteToolsList.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => toggleCategory('favorites')}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    {expandedCategories.has('favorites') ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <Star className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">Favorites</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {favoriteToolsList.length}
                    </span>
                  </button>
                  {expandedCategories.has('favorites') && (
                    <div className="space-y-0.5 ml-6 mt-1">
                      {favoriteToolsList.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-accent',
                              location.pathname === tool.path && 'bg-accent text-accent-foreground'
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Recent Section */}
              {recentToolsList.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() => toggleCategory('recent')}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    {expandedCategories.has('recent') ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">Recent</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {recentToolsList.length}
                    </span>
                  </button>
                  {expandedCategories.has('recent') && (
                    <div className="space-y-0.5 ml-6 mt-1">
                      {recentToolsList.slice(0, 10).map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                            className={cn(
                              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-accent',
                              location.pathname === tool.path && 'bg-accent text-accent-foreground'
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Categories Section */}
              <div className="pt-4">
                <div className="px-3 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </span>
                </div>
                <div className="space-y-0.5">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const categoryTools = getCategoryTools(category.id);
                    const isExpanded = expandedCategories.has(category.id);

                    return (
                      <div key={category.id}>
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate font-medium flex-1 text-left">
                            {category.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {categoryTools.length}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="space-y-0.5 ml-6 mt-1">
                            {categoryTools.map((tool) => {
                              const ToolIcon = tool.icon;
                              return (
                                <Link
                                  key={tool.id}
                                  to={tool.path}
                                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                                  className={cn(
                                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-accent',
                                    location.pathname === tool.path &&
                                      'bg-accent text-accent-foreground'
                                  )}
                                >
                                  <ToolIcon className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate">{tool.name}</span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            ) : (
              // Collapsed view - Icons only
              <div className="space-y-2 flex flex-col items-center">
                <Link
                  to="/"
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-accent',
                    location.pathname === '/' && 'bg-accent text-accent-foreground'
                  )}
                  title="Home"
                >
                  <Home className="h-5 w-5" />
                </Link>

                {favoriteToolsList.length > 0 && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent relative" title="Favorites">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {favoriteToolsList.length}
                    </span>
                  </div>
                )}

                {recentToolsList.length > 0 && (
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent" title="Recent">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="w-full border-t my-2" />

                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors hover:bg-accent cursor-pointer"
                      title={category.name}
                      onClick={() => {
                        setIsCollapsed(false);
                        toggleCategory(category.id);
                      }}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Resize Handle - Desktop Only (only when not collapsed) */}
          {!isCollapsed && (
            <div
              onMouseDown={handleMouseDown}
              className="hidden lg:block absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 transition-colors group"
            >
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary" />
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for desktop to prevent content overlap */}
      <div
        className="hidden lg:block shrink-0 transition-all"
        style={{ width: `${effectiveWidth}px` }}
      />
    </>
  );
}
