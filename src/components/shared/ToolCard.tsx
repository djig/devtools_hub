/**
 * Tool card component
 * Displays a tool with 3D tilt, cursor spotlight, glowing effects, and smooth animations
 */

import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';
import { liquidTransition } from '../../utils/motion';
import { getToolColors } from '../../utils/toolColors';
import { TiltCard, CursorSpotlight } from '../liquid';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const { favoriteTools, toggleFavorite } = useAppStore();
  const isFavorite = favoriteTools.includes(tool.id);
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Link to={tool.path} className="group relative block h-full">
      {/* Outer glow on hover */}
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`} />

      <TiltCard
        maxTilt={shouldReduceMotion ? 0 : 12}
        scale={1.02}
        glareEnabled={!shouldReduceMotion}
        glareColor="rgba(255, 255, 255, 0.2)"
        className="h-full"
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl backdrop-blur-2xl border border-gray-200 dark:border-white/10 p-5 transition-all duration-500 group-hover:border-gray-300 dark:group-hover:border-white/30 bg-white/80 dark:bg-black/20 group-hover:bg-white dark:group-hover:bg-black/30 h-full"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...liquidTransition, delay: index * 0.05 }}
        >
          {/* Cursor-following spotlight */}
          <CursorSpotlight
            color={colors.spotlight}
            size={200}
            intensity={0.6}
            enabled={!shouldReduceMotion}
          />

          {/* Animated shimmer */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header with icon and favorite */}
            <div className="flex items-start justify-between mb-4">
              {/* Rounded Square Icon */}
              <motion.div
                className="relative"
                whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {/* Outer glow */}
                <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r ${colors.gradient} opacity-30 blur-lg group-hover:opacity-60 transition-all duration-500`} />

                {/* Icon container - rounded square */}
                <div className={`relative p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-xl ${colors.glow}`}>
                  <Icon className="h-5 w-5 text-white drop-shadow-lg" strokeWidth={2} />
                </div>
              </motion.div>

              {/* Favorite button */}
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(tool.id);
                }}
                className={cn(
                  'relative p-2 rounded-full backdrop-blur-xl z-20 transition-all duration-300',
                  isFavorite
                    ? 'text-yellow-400 bg-yellow-400/20 border border-yellow-400/50 shadow-lg shadow-yellow-400/30'
                    : 'text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent hover:border-gray-200 dark:hover:border-white/20 opacity-0 group-hover:opacity-100'
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Glow effect for favorite */}
                {isFavorite && (
                  <div className="absolute -inset-1 rounded-full bg-yellow-400/30 blur-md" />
                )}
                <Star className={cn('h-4 w-4 relative', isFavorite && 'fill-current')} />
              </motion.button>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-white/80 transition-all duration-300">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-white/60 transition-colors duration-300">
                {tool.description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
              <span className="text-xs font-medium text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/50 transition-colors capitalize">
                {tool.category}
              </span>

              {/* Arrow button */}
              <motion.div
                className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg ${colors.glow}`}
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ scale: 1.1, x: 0 }}
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Bottom gradient accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </motion.div>
      </TiltCard>
    </Link>
  );
}
