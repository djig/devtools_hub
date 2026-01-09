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
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Icon - colorful background */}
        <div
          className="flex items-center justify-center flex-shrink-0 rounded-full shadow-md"
          style={{
            width: '24px',
            height: '24px',
            background: iconColor,
          }}
        >
          <Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>

        <span
          className="text-gray-200 dark:text-white/90 font-medium whitespace-nowrap"
          style={{ fontSize: '12px' }}
        >
          {tool.name}
        </span>
      </motion.div>
    </Link>
  );
}
