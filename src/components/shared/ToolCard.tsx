/**
 * Tool card component
 * Displays a tool with icon, name, description, and favorite toggle
 * Features liquid glass effects and smooth animations
 */

import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { getIconGradient, getCardGradient } from '../../utils/gradients';
import { cn } from '../../lib/utils';
import { liquidTransition } from '../../utils/motion';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);
  const Icon = tool.icon;
  const cardGradient = getCardGradient(tool.id);
  const iconGradient = getIconGradient(tool.id);
  const shouldReduceMotion = useReducedMotion();

  const cardContent = (
    <>
      {/* Multi-layer glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Icon with enhanced animation */}
      <motion.div
        className={cn(
          'mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br text-white shadow-xl shadow-primary/30 backdrop-blur-sm',
          iconGradient
        )}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 6 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <Icon className="h-5 w-5" strokeWidth={2.5} />
      </motion.div>

      {/* Content */}
      <div className="space-y-2 relative z-10">
        <h3 className="font-semibold text-lg tracking-tight leading-tight text-foreground dark:text-white drop-shadow-sm">
          {tool.name}
        </h3>
        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Favorite Button */}
      <motion.button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(tool.id);
        }}
        className={cn(
          'absolute top-4 right-4 p-2 rounded-xl backdrop-blur-xl z-20',
          isFavorite
            ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/20 border border-yellow-400/40 shadow-lg shadow-yellow-400/20'
            : 'text-muted-foreground dark:text-white/40 hover:text-foreground dark:hover:text-white hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 dark:border-border opacity-0 group-hover:opacity-100'
        )}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
      </motion.button>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
    </>
  );

  const cardClasses = cn(
    'group relative h-full rounded-2xl overflow-hidden',
    `bg-gradient-to-br ${cardGradient}`,
    'backdrop-blur-2xl',
    'border border-white/20 dark:border-border',
    'p-5',
    'bg-white/30 dark:bg-black/20'
  );

  if (shouldReduceMotion) {
    return (
      <Link to={tool.path} className="group">
        <div
          className={cn(
            cardClasses,
            'transition-all duration-400 hover:shadow-2xl hover:shadow-primary/20 hover:border-white/40 dark:hover:border-primary/30'
          )}
        >
          {cardContent}
        </div>
      </Link>
    );
  }

  return (
    <Link to={tool.path} className="group">
      <motion.div
        className={cardClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...liquidTransition,
          delay: index * 0.05,
        }}
        whileHover={{
          y: -4,
          scale: 1.02,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {cardContent}
      </motion.div>
    </Link>
  );
}
