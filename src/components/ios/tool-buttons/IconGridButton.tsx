/**
 * IconGridButton - Square icon tile with name on hover
 * Used for: Generators, Calculators (recognizable icons, compact)
 * Inspired by iOS Control Center quick toggles
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={tool.path}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative"
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
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

        {/* Floating label on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
            >
              <div
                className="px-2 py-1 rounded-lg text-white font-medium"
                style={{
                  fontSize: '10px',
                  background: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {tool.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}
