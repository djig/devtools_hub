/**
 * Tool page layout component
 * Provides consistent structure for all tool pages
 * Features liquid glass effects and smooth animations
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { SEO } from '../../utils/seo';
import { Breadcrumb } from '../shared/Breadcrumb';
import type { LucideIcon } from 'lucide-react';
import type { ToolCategory } from '../../types';
import { getCategoryColors } from '../../utils/categoryColors';
import { getToolByPath } from '../../data/tools';
import { getIconGradient } from '../../utils/gradients';
import { Star, Share2, Check, MoreVertical } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { useClipboard } from '../../hooks';
import { cn } from '../../lib/utils';
import { LiquidBlob } from '../liquid';
import { liquidTransition } from '../../utils/motion';

interface ToolPageLayoutProps {
  // SEO props
  seo: {
    title: string;
    description: string;
    keywords: string;
    path: string;
  };

  // Header props
  icon: LucideIcon;
  title: string;
  description: string;
  category?: ToolCategory;

  // Optional action slot
  actions?: React.ReactNode;

  // Main content
  children: React.ReactNode;
}

export function ToolPageLayout({
  seo,
  icon: Icon,
  title,
  description,
  category,
  actions,
  children,
}: ToolPageLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  // Get the tool by its path to retrieve the tool ID
  const tool = getToolByPath(seo.path);
  const { favoriteTools, toggleFavorite } = useAppStore();
  const { copied, copy } = useClipboard({ showToast: true, successMessage: 'Link copied to clipboard!' });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Use tool-specific gradient (same as ToolCard) if available, otherwise use category colors
  const iconGradient = tool ? getIconGradient(tool.id) : null;
  const colors = category ? getCategoryColors(category) : null;
  const isFavorite = tool ? favoriteTools.includes(tool.id) : false;

  // Update menu position when opening
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192, // 192px = w-48
      });
    }
  }, [menuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleShare = async () => {
    const url = window.location.href;
    await copy(url);
    setMenuOpen(false);
  };

  const handleToggleFavorite = () => {
    if (tool) {
      toggleFavorite(tool.id);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path={seo.path}
      />
      <div className="space-y-6">
        {/* Compact Hero Section with Breadcrumb & Actions */}
        <motion.div
          className={cn(
            'group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-500',
            'bg-white/30 dark:bg-black/20 backdrop-blur-2xl',
            colors ? `border-white/20 dark:border-border/40` : 'border-white/20 dark:border-primary/20',
            'hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.01]',
            menuOpen && 'shadow-2xl shadow-primary/20 -translate-y-1 scale-[1.01]'
          )}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={liquidTransition}
        >
          {/* Liquid blob background */}
          <LiquidBlob
            color1={colors ? colors.gradientFrom : 'from-primary/30'}
            color2={colors ? colors.gradientTo : 'to-purple-500/30'}
            size="lg"
            className="absolute -top-20 -right-20 opacity-30"
          />
          <LiquidBlob
            color1={colors ? colors.gradientTo.replace('to-', 'from-') : 'from-purple-500/30'}
            color2={colors ? colors.gradientFrom.replace('from-', 'to-') : 'to-primary/30'}
            size="md"
            className="absolute -bottom-10 -left-10 opacity-20"
            delay={2}
          />

          {/* Multi-layer glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
          <div className="relative">
            {/* Breadcrumb Navigation */}
            <div className="px-6 pt-4 pb-2">
              <Breadcrumb />
            </div>

            {/* Single Row: Title, Icon & Action Buttons */}
            <div className="flex items-center justify-between gap-4 px-6 pb-6">
              <div className="flex items-center gap-4">
                {iconGradient ? (
                  <div className={cn(
                    'p-3 rounded-xl bg-gradient-to-br text-white shadow-xl shadow-primary/30 transition-all duration-500 backdrop-blur-sm',
                    `bg-gradient-to-br ${iconGradient}`,
                    'group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-primary/50',
                    menuOpen && 'scale-110 rotate-6 shadow-primary/50'
                  )}>
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className={cn(
                    'p-2 rounded-lg bg-primary/10 border border-primary/20',
                    'group-hover:scale-110 group-hover:rotate-6',
                    menuOpen && 'scale-110 rotate-6'
                  )}>
                    <Icon className="h-5 w-5 text-primary transition-transform duration-300" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Custom Actions */}
                {actions && (
                  <div className="flex items-center gap-2">
                    {actions}
                  </div>
                )}

                {/* Menu Dropdown */}
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu - Rendered via Portal */}
                  {menuOpen && createPortal(
                    <div
                      ref={menuRef}
                      className="fixed w-48 rounded-lg border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95"
                      style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                        zIndex: 9999,
                      }}
                    >
                      <button
                        onClick={handleToggleFavorite}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left rounded-t-lg"
                      >
                        <Star className={cn('h-4 w-4', isFavorite && 'fill-current text-yellow-500')} />
                        <span>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left border-t rounded-b-lg"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4" />
                            <span>Share link</span>
                          </>
                        )}
                      </button>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tool Content */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...liquidTransition, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
