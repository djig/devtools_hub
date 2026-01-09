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
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Icon - colorful background */}
        <div
          className="flex items-center justify-center rounded-md shadow-sm"
          style={{
            width: '28px',
            height: '28px',
            background: iconColor,
          }}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2} />
        </div>

        {/* Text */}
        <span
          className="text-gray-700 dark:text-white/80 font-medium whitespace-nowrap"
          style={{ fontSize: '12px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
