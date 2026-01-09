/**
 * Shared Page Header Component
 * Used by both Category and Tool pages for consistent styling
 * Features liquid glass effects and smooth animations
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Star, Share2, Check, MoreVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { LiquidBlob } from '../liquid';
import { cn } from '../../lib/utils';
import { liquidTransition } from '../../utils/motion';
import { useClipboard } from '../../hooks';
import useAppStore from '../../store/useAppStore';

interface PageHeaderProps {
  /** Icon component to display */
  icon: LucideIcon;
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Icon background gradient classes (e.g., "from-blue-500 to-cyan-400") */
  iconGradient?: string;
  /** Gradient colors for liquid blobs */
  blobColors?: {
    from: string;
    to: string;
  };
  /** Optional badge content (e.g., "6 tools available") */
  badge?: React.ReactNode;
  /** Optional badge gradient for text */
  badgeGradient?: string;
  /** Tool ID for favorites functionality */
  toolId?: string;
  /** Show actions menu (favorites, share) */
  showActions?: boolean;
  /** Additional actions to render */
  actions?: React.ReactNode;
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  iconGradient = 'from-primary to-purple-500',
  blobColors,
  badge,
  badgeGradient,
  toolId,
  showActions = false,
  actions,
}: PageHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const { favoriteTools, toggleFavorite } = useAppStore();
  const { copied, copy } = useClipboard({ showToast: true, successMessage: 'Link copied to clipboard!' });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const isFavorite = toolId ? favoriteTools.includes(toolId) : false;

  // Update menu position when opening
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192,
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
    if (toolId) {
      toggleFavorite(toolId);
    }
    setMenuOpen(false);
  };

  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl border shadow-sm transition-all duration-500',
        'bg-white/30 dark:bg-black/20 backdrop-blur-2xl',
        'border-white/20 dark:border-border/40',
        'hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.01] hover:border-white/30 dark:hover:border-primary/30',
        menuOpen && 'shadow-2xl shadow-primary/20 -translate-y-1 scale-[1.01] border-white/30 dark:border-primary/30'
      )}
      initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={liquidTransition}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
    >
      {/* Liquid blob background */}
      <LiquidBlob
        color1={blobColors?.from || 'from-primary/30'}
        color2={blobColors?.to || 'to-purple-500/30'}
        size="lg"
        className="absolute -top-20 -right-20 opacity-30"
      />
      <LiquidBlob
        color1={blobColors?.to?.replace('to-', 'from-') || 'from-purple-500/30'}
        color2={blobColors?.from?.replace('from-', 'to-') || 'to-primary/30'}
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
        <div className="px-5 pt-3 pb-2">
          <Breadcrumb />
        </div>

        {/* Header Content */}
        <div className="flex items-center justify-between gap-4 px-5 pb-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={cn(
                'p-2.5 rounded-xl bg-gradient-to-br text-white shadow-xl transition-all duration-500 backdrop-blur-sm',
                iconGradient,
                'shadow-primary/30 group-hover:shadow-primary/50',
                'group-hover:scale-110 group-hover:rotate-6',
                menuOpen && 'scale-110 rotate-6 shadow-primary/50'
              )}
            >
              <Icon className="h-5 w-5 transition-transform duration-300" strokeWidth={2} />
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>

              {/* Optional Badge */}
              {badge && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 mt-2 rounded-full bg-muted/50 dark:bg-muted/30 border border-border backdrop-blur-xl">
                  {badgeGradient ? (
                    <span className={`text-xs font-medium bg-gradient-to-r ${badgeGradient} bg-clip-text text-transparent`}>
                      {badge}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {badge}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {(showActions || actions) && (
            <div className="flex items-center gap-2 shrink-0">
              {actions}

              {showActions && (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

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
                      {toolId && (
                        <button
                          onClick={handleToggleFavorite}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left rounded-t-lg"
                        >
                          <Star className={cn('h-4 w-4', isFavorite && 'fill-current text-yellow-500')} />
                          <span>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</span>
                        </button>
                      )}

                      <button
                        onClick={handleShare}
                        className={cn(
                          'flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-accent transition-colors text-left',
                          toolId ? 'border-t rounded-b-lg' : 'rounded-lg'
                        )}
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
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
