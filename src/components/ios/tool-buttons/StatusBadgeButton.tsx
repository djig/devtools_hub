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
        {/* Badge container */}
        <div
          className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl overflow-hidden transition-all duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {/* Pulsing status dot */}
          <div className="relative flex-shrink-0">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: iconColor }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: iconColor }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          </div>

          {/* Icon */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-lg transition-all duration-200 group-hover:scale-110"
            style={{
              width: '28px',
              height: '28px',
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}30`,
            }}
          >
            <Icon
              style={{ color: iconColor }}
              className="h-4 w-4"
              strokeWidth={2}
            />
          </div>

          {/* Text */}
          <span className="flex-1 text-white/80 font-medium text-sm truncate group-hover:text-white transition-colors">
            {tool.name}
          </span>

          {/* Status indicator bar */}
          <div
            className="h-1 w-8 rounded-full overflow-hidden bg-white/5"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: iconColor }}
              initial={{ width: '30%' }}
              animate={{ width: ['30%', '100%', '30%'] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
            />
          </div>

          {/* Hover highlight */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${iconColor}08, transparent)`,
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
