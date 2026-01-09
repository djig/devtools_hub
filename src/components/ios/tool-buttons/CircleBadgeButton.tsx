/**
 * CircleBadgeButton - Circular badge with icon and curved text
 * Used for: DateTime (clock/time inspired)
 * Inspired by iOS Clock app and time widgets
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface CircleBadgeButtonProps {
  tool: Tool;
  index?: number;
}

export function CircleBadgeButton({ tool, index = 0 }: CircleBadgeButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group">
      <motion.div
        className="relative flex flex-col items-center gap-1.5"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08, type: 'spring' }}
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.1,
          rotate: 5,
          transition: { type: 'spring', stiffness: 300, damping: 15 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Circular badge */}
        <div className="relative">
          {/* Glow ring - visible by default */}
          <div
            className="absolute -inset-2 rounded-full blur-md transition-all duration-300 group-hover:blur-lg group-hover:opacity-70"
            style={{
              background: iconColor,
              opacity: 0.4,
            }}
          />

          {/* Outer ring - enhanced gradient */}
          <div
            className="relative flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: '52px',
              height: '52px',
              background: `conic-gradient(from 180deg, ${iconColor}60, ${iconColor}25, ${iconColor}60)`,
              padding: '2px',
            }}
          >
            {/* Inner circle - enhanced */}
            <div
              className="flex items-center justify-center rounded-full w-full h-full"
              style={{
                background: `linear-gradient(145deg, ${iconColor}20, rgba(20,20,25,0.95))`,
                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 16px ${iconColor}40`,
              }}
            >
              <Icon
                className="transition-all duration-200 group-hover:scale-110"
                style={{ color: iconColor, width: '22px', height: '22px' }}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Animated ring - visible by default */}
          <motion.div
            className="absolute inset-0 rounded-full transition-opacity duration-300 group-hover:opacity-100"
            style={{
              border: `2px solid ${iconColor}80`,
              borderTopColor: 'transparent',
              opacity: 0.6,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Label below */}
        <span
          className="text-gray-600 dark:text-white/70 font-medium text-center transition-colors group-hover:text-gray-900 dark:group-hover:text-white max-w-[80px] truncate"
          style={{ fontSize: '10px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
