/**
 * StatusBadgeButton - Network status inspired badge
 * Used for: Network & Security (monitoring/status inspired)
 * Inspired by network status indicators and security badges
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface StatusBadgeButtonProps {
  tool: Tool;
  index?: number;
}

export function StatusBadgeButton({ tool, index = 0 }: StatusBadgeButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group block">
      <motion.div
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Badge container - enhanced with default glow */}
        <div
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden transition-all duration-200"
          style={{
            background: `linear-gradient(90deg, ${iconColor}10, rgba(255, 255, 255, 0.02))`,
            border: `1px solid ${iconColor}25`,
            boxShadow: `0 2px 12px ${iconColor}20`,
          }}
        >
          {/* Pulsing status dot - enhanced */}
          <div className="relative flex-shrink-0">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: iconColor,
                boxShadow: `0 0 8px ${iconColor}80`,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: iconColor }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          </div>

          {/* Icon - enhanced background */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-200 group-hover:scale-110"
            style={{
              width: '32px',
              height: '32px',
              background: `linear-gradient(135deg, ${iconColor}30, ${iconColor}15)`,
              border: `1px solid ${iconColor}40`,
              boxShadow: `0 2px 8px ${iconColor}25`,
            }}
          >
            <Icon
              style={{ color: iconColor }}
              className="h-4 w-4"
              strokeWidth={2}
            />
          </div>

          {/* Text */}
          <span className="flex-1 text-gray-700 dark:text-white/90 font-medium text-sm truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {tool.name}
          </span>

          {/* Status indicator bar - enhanced */}
          <div
            className="h-1.5 w-10 rounded-full overflow-hidden"
            style={{ background: `${iconColor}20` }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${iconColor}, ${iconColor}80)`,
                boxShadow: `0 0 6px ${iconColor}60`,
              }}
              initial={{ width: '30%' }}
              animate={{ width: ['30%', '100%', '30%'] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            />
          </div>

          {/* Highlight - visible by default */}
          <div
            className="absolute inset-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100"
            style={{
              background: `linear-gradient(90deg, ${iconColor}15, transparent)`,
              opacity: 0.5,
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
