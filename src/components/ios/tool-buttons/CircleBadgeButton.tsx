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
        className="flex flex-col items-center gap-1.5"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.06 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Circular badge - colorful background */}
        <div
          className="flex items-center justify-center rounded-full transition-all duration-200 shadow-lg"
          style={{
            width: '52px',
            height: '52px',
            background: iconColor,
          }}
        >
          <Icon
            className="transition-all duration-200 group-hover:scale-110 text-white"
            style={{ width: '22px', height: '22px' }}
            strokeWidth={2}
          />
        </div>

        {/* Label below */}
        <span
          className="text-gray-600 dark:text-white/60 font-medium text-center transition-colors group-hover:text-gray-900 dark:group-hover:text-white/90 max-w-[80px] truncate"
          style={{ fontSize: '10px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
