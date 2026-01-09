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
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : { x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Row container */}
        <div
          className="relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group-hover:bg-white/5"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Icon container */}
          <div
            className="flex items-center justify-center flex-shrink-0 rounded-lg transition-transform duration-200 group-hover:scale-110"
            style={{
              width: '32px',
              height: '32px',
              background: `linear-gradient(135deg, ${iconColor}, ${iconColor}cc)`,
              boxShadow: `0 2px 8px ${iconColor}40`,
            }}
          >
            <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>

          {/* Tool name */}
          <span className="flex-1 text-white/90 font-medium text-sm truncate">
            {tool.name}
          </span>

          {/* Chevron */}
          <ChevronRight
            className="h-4 w-4 text-white/30 transition-all duration-200 group-hover:text-white/60 group-hover:translate-x-1"
          />
        </div>

        {/* Bottom border (except last item) */}
        <div
          className="absolute bottom-0 left-12 right-3 h-px bg-white/5"
        />
      </motion.div>
    </Link>
  );
}
