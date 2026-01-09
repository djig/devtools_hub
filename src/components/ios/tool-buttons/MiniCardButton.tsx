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
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.05,
          y: -4,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect - visible by default */}
        <div
          className="absolute -inset-1.5 rounded-2xl blur-lg transition-all duration-300 group-hover:blur-xl group-hover:opacity-60"
          style={{
            background: iconColor,
            opacity: 0.35,
          }}
        />

        {/* Card with gradient background */}
        <div
          className="relative overflow-hidden rounded-xl p-3 transition-all duration-200"
          style={{
            background: `linear-gradient(145deg, ${iconColor}35, ${iconColor}15)`,
            border: `1px solid ${iconColor}40`,
            boxShadow: `0 4px 20px ${iconColor}30, inset 0 1px 0 rgba(255,255,255,0.1)`,
            minWidth: '140px',
          }}
        >
          {/* Shine effect - always visible */}
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
            }}
          />

          {/* Animated shine on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, transparent 30%, ${iconColor}20 50%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-3">
            {/* Icon with glow */}
            <div
              className="flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
              style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${iconColor}, ${iconColor}bb)`,
                boxShadow: `0 4px 16px ${iconColor}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}
            >
              <Icon className="h-5 w-5 text-white drop-shadow-sm" strokeWidth={2} />
            </div>

            {/* Text */}
            <span
              className="text-white font-semibold truncate"
              style={{
                fontSize: '13px',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {tool.name}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
