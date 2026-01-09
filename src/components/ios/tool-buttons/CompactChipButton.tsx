/**
 * CompactChipButton - Minimal chip with colored accent
 * Used for: Encoders (technical, code-inspired)
 * Inspired by code editor tags/badges
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface CompactChipButtonProps {
  tool: Tool;
  index?: number;
}

export function CompactChipButton({ tool, index = 0 }: CompactChipButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group">
      <motion.div
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Chip */}
        <div
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg overflow-hidden transition-all duration-200 group-hover:bg-white/5"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Left color accent bar */}
          <div
            className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full transition-all duration-200 group-hover:h-[calc(100%-4px)]"
            style={{
              background: iconColor,
              boxShadow: `0 0 8px ${iconColor}60`,
            }}
          />

          {/* Icon */}
          <div
            className="flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              width: '20px',
              height: '20px',
              marginLeft: '4px',
            }}
          >
            <Icon
              style={{ color: iconColor }}
              className="h-4 w-4"
              strokeWidth={2}
            />
          </div>

          {/* Text */}
          <span
            className="text-white/80 font-medium whitespace-nowrap transition-colors group-hover:text-white"
            style={{ fontSize: '12px' }}
          >
            {tool.name}
          </span>

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: `linear-gradient(90deg, ${iconColor}10, transparent)`,
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}
