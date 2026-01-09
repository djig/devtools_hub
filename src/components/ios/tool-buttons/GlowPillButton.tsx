/**
 * GlowPillButton - Original iOS pill style with colored glow
 * Used for: Text Tools
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { Tool } from '../../../types';
import { getToolColors } from '../../../utils/toolColors';
import { getIOSColor } from '../../../utils/iosColors';

interface GlowPillButtonProps {
  tool: Tool;
  index?: number;
}

export function GlowPillButton({ tool, index = 0 }: GlowPillButtonProps) {
  const Icon = tool.icon;
  const colors = getToolColors(tool.id);
  const shouldReduceMotion = useReducedMotion();
  const iconColor = getIOSColor(colors.gradient);

  return (
    <Link to={tool.path} className="group">
      <motion.div
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.08,
          y: -2,
          transition: { type: 'spring', stiffness: 400, damping: 17 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Outer glow - visible by default */}
        <div
          className="absolute -inset-1 rounded-full blur-md transition-all duration-300 group-hover:blur-lg group-hover:opacity-70"
          style={{ background: iconColor, opacity: 0.35 }}
        />

        {/* Inner glow ring */}
        <div
          className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${iconColor}40, transparent, ${iconColor}20)` }}
        />

        {/* Pill Button */}
        <div
          className="relative flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `0 4px 12px rgba(0, 0, 0, 0.2), 0 0 20px ${iconColor}15, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
          }}
        >
          <motion.div
            className="flex items-center justify-center flex-shrink-0"
            whileHover={shouldReduceMotion ? {} : { rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.3 }}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
              boxShadow: `0 2px 8px ${iconColor}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
          >
            <Icon className="h-3.5 w-3.5 text-white drop-shadow-sm" strokeWidth={2.5} />
          </motion.div>

          <span
            className="text-white font-semibold whitespace-nowrap"
            style={{ fontSize: '12px', letterSpacing: '-0.2px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
          >
            {tool.name}
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
