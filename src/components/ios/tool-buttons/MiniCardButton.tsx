/**
 * MiniCardButton - Small card with gradient background (always visible)
 * Used for: Converters, Formatters (medium-sized categories)
 * Inspired by iOS widget cards
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface MiniCardButtonProps {
  tool: Tool;
  index?: number;
}

export function MiniCardButton({ tool, index = 0 }: MiniCardButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group">
      <motion.div
        className="relative overflow-hidden rounded-xl p-3 transition-all duration-200"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.02,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          minWidth: '140px',
        }}
      >
        {/* Content */}
        <div className="flex items-center gap-3">
          {/* Icon - colorful background */}
          <div
            className="flex items-center justify-center rounded-lg transition-all duration-200 group-hover:scale-105 shadow-md"
            style={{
              width: '36px',
              height: '36px',
              background: iconColor,
            }}
          >
            <Icon className="h-4.5 w-4.5 text-white" strokeWidth={2} />
          </div>

          {/* Text */}
          <span
            className="text-gray-700 dark:text-white/90 font-medium truncate"
            style={{ fontSize: '13px' }}
          >
            {tool.name}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
