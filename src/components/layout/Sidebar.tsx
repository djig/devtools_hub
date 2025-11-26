import { Link, useLocation } from 'react-router-dom';
import { X, Star, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { categories, tools } from '../../data/tools';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar, recentTools, favoriteTools } = useAppStore();

  const recentToolsList = tools.filter((tool) => recentTools.includes(tool.id));
  const favoriteToolsList = tools.filter((tool) => favoriteTools.includes(tool.id));

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4">
            <div className="space-y-6">
              {/* Favorites */}
              {favoriteToolsList.length > 0 && (
                <div>
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Star className="h-3 w-3" />
                    Favorites
                  </h3>
                  <div className="space-y-1">
                    {favoriteToolsList.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                            location.pathname === tool.path && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent */}
              {recentToolsList.length > 0 && (
                <div>
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Recent
                  </h3>
                  <div className="space-y-1">
                    {recentToolsList.slice(0, 5).map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                            location.pathname === tool.path && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                          location.pathname === `/category/${category.id}` &&
                            'bg-accent text-accent-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
