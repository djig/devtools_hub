/**
 * NeonGlow Component
 * Pulsing neon glow wrapper for elements
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

interface NeonGlowProps {
  /** Wrapped content */
  children: ReactNode;
  /** Primary glow color (default: blue) */
  color?: string;
  /** Secondary glow color for gradient (optional) */
  secondaryColor?: string;
  /** Glow intensity: low, medium, high (default: medium) */
  intensity?: 'low' | 'medium' | 'high';
  /** Enable pulsing animation (default: true) */
  pulse?: boolean;
  /** Additional class names */
  className?: string;
  /** Whether glow is enabled */
  enabled?: boolean;
}

const intensityConfig = {
  low: { blur: 15, spread: 2, opacity: 0.3 },
  medium: { blur: 20, spread: 4, opacity: 0.5 },
  high: { blur: 30, spread: 6, opacity: 0.7 },
};

export function NeonGlow({
  children,
  color = '#3b82f6',
  secondaryColor,
  intensity = 'medium',
  pulse = true,
  className = '',
  enabled = true,
}: NeonGlowProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = intensityConfig[intensity];

  const baseBoxShadow = secondaryColor
    ? `0 0 ${config.blur}px ${config.spread}px ${color}${Math.round(config.opacity * 100).toString(16).padStart(2, '0')},
       0 0 ${config.blur * 2}px ${config.spread * 2}px ${secondaryColor}${Math.round(config.opacity * 0.5 * 100).toString(16).padStart(2, '0')}`
    : `0 0 ${config.blur}px ${config.spread}px ${color}${Math.round(config.opacity * 100).toString(16).padStart(2, '0')},
       0 0 ${config.blur * 2}px ${config.spread * 2}px ${color}${Math.round(config.opacity * 0.3 * 100).toString(16).padStart(2, '0')}`;

  if (!enabled || shouldReduceMotion) {
    return (
      <div className={cn('relative', className)} style={{ boxShadow: baseBoxShadow }}>
        {children}
      </div>
    );
  }

  if (!pulse) {
    return (
      <div className={cn('relative', className)} style={{ boxShadow: baseBoxShadow }}>
        {children}
      </div>
    );
  }

  const pulseBoxShadow = secondaryColor
    ? `0 0 ${config.blur * 1.5}px ${config.spread * 1.5}px ${color}${Math.round(config.opacity * 1.2 * 100).toString(16).padStart(2, '0')},
       0 0 ${config.blur * 3}px ${config.spread * 3}px ${secondaryColor}${Math.round(config.opacity * 0.7 * 100).toString(16).padStart(2, '0')}`
    : `0 0 ${config.blur * 1.5}px ${config.spread * 1.5}px ${color}${Math.round(config.opacity * 1.2 * 100).toString(16).padStart(2, '0')},
       0 0 ${config.blur * 3}px ${config.spread * 3}px ${color}${Math.round(config.opacity * 0.5 * 100).toString(16).padStart(2, '0')}`;

  return (
    <motion.div
      className={cn('relative', className)}
      animate={{
        boxShadow: [baseBoxShadow, pulseBoxShadow, baseBoxShadow],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Neon text wrapper
 */
export function NeonText({
  children,
  color = '#3b82f6',
  intensity = 'medium',
  className = '',
}: {
  children: ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const config = intensityConfig[intensity];

  const textShadow = `0 0 ${config.blur / 2}px ${color},
                      0 0 ${config.blur}px ${color},
                      0 0 ${config.blur * 1.5}px ${color}`;

  if (shouldReduceMotion) {
    return (
      <span className={className} style={{ textShadow, color }}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      style={{ color }}
      animate={{
        textShadow: [
          textShadow,
          `0 0 ${config.blur}px ${color}, 0 0 ${config.blur * 1.5}px ${color}, 0 0 ${config.blur * 2}px ${color}`,
          textShadow,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span>
  );
}
