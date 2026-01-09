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
        className="relative flex flex-col items-center gap-1.5"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Icon container */}
        <div className="relative">
          {/* Glow effect - visible by default */}
          <div
            className="absolute -inset-2 rounded-2xl blur-lg transition-all duration-300 group-hover:blur-xl group-hover:opacity-70"
            style={{
              background: iconColor,
              opacity: 0.4,
            }}
          />

          {/* Icon tile with enhanced gradient */}
          <div
            className="relative flex items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-105"
            style={{
              width: '56px',
              height: '56px',
              background: `linear-gradient(145deg, ${iconColor}45, ${iconColor}25)`,
              border: `1px solid ${iconColor}50`,
              boxShadow: `0 4px 20px ${iconColor}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
            }}
          >
            {/* Inner highlight */}
            <div
              className="absolute inset-0 rounded-2xl opacity-50"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
              }}
            />

            <Icon
              className="relative z-10 transition-transform duration-200 group-hover:scale-110"
              style={{ color: iconColor, width: '24px', height: '24px' }}
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Label below - always visible */}
        <span
          className="text-gray-600 dark:text-white/70 font-medium text-center transition-colors group-hover:text-gray-900 dark:group-hover:text-white max-w-[70px] truncate"
          style={{ fontSize: '10px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
