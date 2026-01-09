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
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
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
          className="flex items-center justify-center flex-shrink-0 rounded-md shadow-sm"
          style={{
            width: '28px',
            height: '28px',
            background: iconColor,
          }}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2} />
        </div>

        {/* Text */}
        <span className="flex-1 text-gray-700 dark:text-white/80 font-medium text-sm truncate">
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
