/**
 * Application header component
 * Features stunning glass effects, glowing badges, and smooth animations
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun, Monitor, Search, Home, Star, Clock, Menu, Command } from 'lucide-react';
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
  const shouldReduceMotion = useReducedMotion();

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
            colors={['from-blue-500/10', 'via-purple-500/10', 'to-pink-500/10']}
            speed="slow"
            direction="horizontal"
          />
        </div>

        {/* Glass effect container */}
        <div className="relative border-b border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-2xl">
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          {/* Glass shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="container flex h-16 items-center justify-between gap-4">
            {/* Left: Hamburger Menu + Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <motion.button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-white/70" />
              </motion.button>

              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  className="relative"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {/* Logo glow */}
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-md group-hover:opacity-80 transition-opacity" />
                  <img src="/logo.svg" alt="DevTools Hub" className="relative h-9 w-9 drop-shadow-2xl" />
                </motion.div>
              </Link>
            </div>

            {/* Center: Title with animated gradient */}
            <Link to="/" className="flex-1 flex justify-center min-w-0">
              <motion.h1
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                  Developer Tools Hub
                </span>
              </motion.h1>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Button - Prominent */}
              <motion.button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="h-4 w-4 text-gray-500 dark:text-white/50 group-hover:text-gray-700 dark:group-hover:text-white/70" />
                <span className="hidden sm:inline text-sm text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/60">Search</span>
                <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-[10px] text-gray-500 dark:text-white/40">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </motion.button>

              {!isHome && (
                <Link to="/">
                  <motion.div
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="h-4 w-4 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70" />
                  </motion.div>
                </Link>
              )}

              {/* Favorites with glowing badge */}
              {favoriteTools.length > 0 && (
                <Link to="/favorites">
                  <motion.div
                    className="relative p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Star className="h-4 w-4 text-yellow-400" />
                    {/* Glowing badge */}
                    <motion.div
                      className="absolute -top-1.5 -right-1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-yellow-400 blur-sm opacity-50" />
                      <div className="relative h-5 w-5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-[10px] font-bold text-black shadow-lg shadow-yellow-400/30">
                        {favoriteTools.length}
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              )}

              {/* Recent with badge */}
              {recentTools.length > 0 && (
                <Link to="/recent">
                  <motion.div
                    className="relative p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Clock className="h-4 w-4 text-blue-400" />
                    {/* Glowing badge */}
                    <motion.div
                      className="absolute -top-1.5 -right-1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-blue-400 blur-sm opacity-50" />
                      <div className="relative h-5 w-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-400/30">
                        {recentTools.length > 9 ? '9+' : recentTools.length}
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              )}

              {/* Theme toggle with glow */}
              <motion.button
                onClick={cycleTheme}
                className="relative p-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 opacity-30 blur-md ${
                  theme === 'light' ? 'bg-yellow-400' : theme === 'dark' ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <ThemeIcon className={`relative h-4 w-4 ${
                  theme === 'light' ? 'text-yellow-400' : theme === 'dark' ? 'text-blue-400' : 'text-purple-400'
                }`} />
              </motion.button>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
