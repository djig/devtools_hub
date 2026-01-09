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
          {/* Glow ring */}
          <div
            className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-60 blur-md transition-opacity duration-300"
            style={{ background: iconColor }}
          />

          {/* Outer ring */}
          <div
            className="relative flex items-center justify-center rounded-full transition-all duration-300"
            style={{
              width: '52px',
              height: '52px',
              background: `conic-gradient(from 180deg, ${iconColor}40, ${iconColor}10, ${iconColor}40)`,
              padding: '2px',
            }}
          >
            {/* Inner circle */}
            <div
              className="flex items-center justify-center rounded-full w-full h-full"
              style={{
                background: `linear-gradient(145deg, rgba(30,30,35,0.9), rgba(20,20,25,0.95))`,
                boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 12px ${iconColor}30`,
              }}
            >
              <Icon
                className="transition-all duration-200 group-hover:scale-110"
                style={{ color: iconColor, width: '22px', height: '22px' }}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Animated ring on hover */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
            style={{
              border: `2px solid ${iconColor}`,
              borderTopColor: 'transparent',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Label below */}
        <span
          className="text-white/70 font-medium text-center transition-colors group-hover:text-white max-w-[80px] truncate"
          style={{ fontSize: '10px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
