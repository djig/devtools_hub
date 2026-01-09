/**
 * ListRowButton - Full width row with icon, name, and chevron
 * Used for: Developer Tools (many items, easy scanning)
 * Inspired by iOS Settings list style
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface ListRowButtonProps {
  tool: Tool;
  index?: number;
}

export function ListRowButton({ tool, index = 0 }: ListRowButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group block w-full">
      <motion.div
        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : { x: 2 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
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

        {/* Tool name */}
        <span className="flex-1 text-gray-700 dark:text-white/80 font-medium text-sm truncate">
          {tool.name}
        </span>

        {/* Chevron */}
        <ChevronRight
          className="h-4 w-4 text-gray-400 dark:text-white/30 transition-all duration-200 group-hover:text-gray-600 dark:group-hover:text-white/50 group-hover:translate-x-1"
        />
      </motion.div>
    </Link>
  );
}
