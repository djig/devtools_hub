import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Search, Home, Star, Clock, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandPalette } from '../shared/CommandPalette';
import useAppStore from '../../store/useAppStore';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { theme, setTheme, recentTools, favoriteTools, toggleSidebar } = useAppStore();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          {/* Left: Hamburger Menu + Logo */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                DevTools Hub
              </div>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors text-sm text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span>Search tools...</span>
              <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-background border border-border text-xs font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {!isHome && (
              <Link to="/">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {favoriteTools.length > 0 && (
              <Link to="/favorites">
                <Button variant="ghost" size="icon" className="rounded-xl relative">
                  <Star className="h-5 w-5" />
                  {favoriteTools.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {favoriteTools.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {recentTools.length > 0 && (
              <Link to="/recent">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Clock className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" onClick={cycleTheme} className="rounded-xl">
              <ThemeIcon className="h-5 w-5" />
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setIsCommandOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
