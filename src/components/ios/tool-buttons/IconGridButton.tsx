/**
 * IconGridButton - Square icon tile with name below
 * Used for: Generators, Calculators (recognizable icons, compact)
 * Inspired by iOS Control Center quick toggles
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface IconGridButtonProps {
  tool: Tool;
  index?: number;
}

export function IconGridButton({ tool, index = 0 }: IconGridButtonProps) {
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
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Icon tile - colorful background */}
        <div
          className="flex items-center justify-center rounded-xl transition-all duration-200 shadow-lg"
          style={{
            width: '52px',
            height: '52px',
            background: iconColor,
          }}
        >
          <Icon
            className="transition-transform duration-200 group-hover:scale-110 text-white"
            style={{ width: '22px', height: '22px' }}
            strokeWidth={2}
          />
        </div>

        {/* Label below */}
        <span
          className="text-gray-600 dark:text-white/60 font-medium text-center transition-colors group-hover:text-gray-900 dark:group-hover:text-white/90 max-w-[70px] truncate"
          style={{ fontSize: '10px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
