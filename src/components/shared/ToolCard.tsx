/**
 * Tool card component - iOS Control Center Ultrathin style
 * Frosted glass effect matching iOS exactly
 */

import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../types';
import useAppStore from '../../store/useAppStore';
import { cn } from '../../lib/utils';
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

  // Get iOS system color for icon
  const getIconColor = () => {
    if (colors.gradient.includes('blue') || colors.gradient.includes('cyan')) return '#007AFF';
    if (colors.gradient.includes('green') || colors.gradient.includes('emerald')) return '#30D158';
    if (colors.gradient.includes('purple') || colors.gradient.includes('violet')) return '#BF5AF2';
    if (colors.gradient.includes('orange') || colors.gradient.includes('amber')) return '#FF9F0A';
    if (colors.gradient.includes('pink') || colors.gradient.includes('rose')) return '#FF375F';
    if (colors.gradient.includes('teal')) return '#64D2FF';
    if (colors.gradient.includes('red')) return '#FF453A';
    if (colors.gradient.includes('indigo')) return '#5E5CE6';
    if (colors.gradient.includes('lime')) return '#30D158';
    return '#007AFF';
  };

  return (
    <Link to={tool.path} className="group relative block">
      {/* Outer glow on hover */}
      <div
        className={`absolute -inset-1 rounded-[52px] bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
      />

      <TiltCard
        maxTilt={shouldReduceMotion ? 0 : 6}
        scale={1.02}
        glareEnabled={!shouldReduceMotion}
        glareColor="rgba(255, 255, 255, 0.15)"
        className="h-full"
      >
        <motion.div
          className={cn(
            'relative overflow-hidden',
            // Layout - horizontal like iOS
            'flex items-center gap-3',
            'px-3 py-2.5',
            // Transition
            'transition-all duration-200',
            // iOS Glass styling
            'ios-glass-pill rounded-[50px]',
          )}
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
        >
          {/* Cursor-following spotlight */}
          <CursorSpotlight
            color={colors.spotlight}
            size={150}
            intensity={0.4}
            enabled={!shouldReduceMotion}
          />

          {/* Animated shimmer */}
          <div className="absolute inset-0 overflow-hidden rounded-[50px]">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>

          {/* Circular Icon - Colored background */}
          <div
            className="flex items-center justify-center flex-shrink-0 relative z-10"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: getIconColor(),
              boxShadow: `0 4px 12px ${getIconColor()}40`,
            }}
          >
            <Icon
              className="h-5 w-5 text-white"
              strokeWidth={2.5}
            />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0 py-0.5 relative z-10">
            <h3
              className="font-semibold text-gray-900 dark:text-white leading-tight truncate"
              style={{ fontSize: '15px', letterSpacing: '-0.24px' }}
            >
              {tool.name}
            </h3>
            <p
              className="leading-tight truncate mt-0.5 text-gray-600 dark:text-white/55"
              style={{ fontSize: '13px' }}
            >
              {tool.description}
            </p>
          </div>

          {/* Favorite button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(tool.id);
            }}
            className={cn(
              'p-1.5 rounded-full transition-colors duration-200 z-20 flex-shrink-0 relative',
              isFavorite ? 'text-yellow-400' : 'text-gray-400 dark:text-white/35'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className={cn('h-5 w-5', isFavorite && 'fill-current')} />
          </motion.button>
        </motion.div>
      </TiltCard>
    </Link>
  );
}
