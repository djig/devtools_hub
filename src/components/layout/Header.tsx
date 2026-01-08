/**
 * Application header component
 * Includes navigation, search, theme toggle, and quick actions
 * Features liquid glass effects and smooth animations
 */

import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Moon, Sun, Monitor, Search, Home, Star, Clock, Menu } from 'lucide-react';
import { Button } from '../ui/Button';
import { CommandPalette } from '../shared/CommandPalette';
import useAppStore from '../../store/useAppStore';
import { useKeyboardShortcut, useTheme } from '../../hooks';
import { Link, useLocation } from 'react-router-dom';
import { FlowingGradient } from '../liquid';

export function Header() {
  const { recentTools, favoriteTools, toggleSidebar } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  useReducedMotion(); // Hook used for accessibility awareness

  // Register Cmd/Ctrl+K shortcut to open command palette
  useKeyboardShortcut(
    { key: 'k', metaKey: true },
    () => setIsCommandOpen(true)
  );

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Flowing gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <FlowingGradient
            colors={['from-blue-500/5', 'via-purple-500/5', 'to-pink-500/5']}
            speed="slow"
            direction="horizontal"
          />
        </div>

        {/* Glass effect container */}
        <div className="relative border-b border-white/20 dark:border-border/40 bg-white/70 dark:bg-background/70 backdrop-blur-2xl shadow-lg shadow-black/5">
          {/* Glass shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 pointer-events-none" />

          <div className="container flex h-14 items-center justify-between gap-2">
            {/* Left: Hamburger Menu + Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Link to="/" className="flex items-center group">
                <img src="/logo.svg" alt="DevTools Hub" className="h-8 w-8" />
              </Link>
            </div>

            {/* Center: Title with gradient */}
            <Link to="/" className="flex-1 flex justify-center min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                Developer Tools Hub
              </h1>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setIsCommandOpen(true)}
                title="Search (⌘K)"
              >
                <Search className="h-4 w-4" />
              </Button>

              {!isHome && (
                <Link to="/">
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 sm:h-9 sm:w-9">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              {favoriteTools.length > 0 && (
                <Link to="/favorites">
                  <Button variant="ghost" size="icon" className="rounded-xl relative h-8 w-8 sm:h-9 sm:w-9">
                    <Star className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary text-[9px] sm:text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {favoriteTools.length}
                    </span>
                  </Button>
                </Link>
              )}

              {recentTools.length > 0 && (
                <Link to="/recent">
                  <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8 sm:h-9 sm:w-9">
                    <Clock className="h-4 w-4" />
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" onClick={cycleTheme} className="rounded-xl h-8 w-8 sm:h-9 sm:w-9">
                <ThemeIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
