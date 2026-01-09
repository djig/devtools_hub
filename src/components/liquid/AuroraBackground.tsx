/**
 * AuroraBackground Component
 * Northern lights wave effect with multiple color layers
 */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

interface AuroraBackgroundProps {
  /** Aurora colors (default: blue, purple, pink) */
  colors?: string[];
  /** Animation speed: slow, medium, fast (default: medium) */
  speed?: 'slow' | 'medium' | 'fast';
  /** Overall opacity (default: CSS variable) */
  opacity?: number;
  /** Additional class names */
  className?: string;
  /** Whether aurora is enabled */
  enabled?: boolean;
}

const speedDurations = {
  slow: { base: 30, offset: 35 },
  medium: { base: 20, offset: 25 },
  fast: { base: 12, offset: 15 },
};

export function AuroraBackground({
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  speed = 'medium',
  opacity,
  className = '',
  enabled = true,
}: AuroraBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const durations = speedDurations[speed];

  if (!enabled) return null;

  // Static fallback for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors[0]}20 0%, ${colors[1]}15 50%, ${colors[2]}20 100%)`,
            opacity: opacity ?? 0.3,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
      style={{ opacity: opacity ?? 'var(--aurora-opacity)' }}
    >
      {/* Layer 1 - Primary wave */}
      <motion.div
        className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${colors[0]}40 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
        animate={{
          x: ['-50%', '-30%', '-70%', '-50%'],
          y: ['0%', '-20%', '10%', '0%'],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: durations.base,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Layer 2 - Secondary wave (offset timing) */}
      <motion.div
        className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%]"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 60% 40%, ${colors[1]}35 0%, transparent 70%)`,
          filter: 'blur(50px)',
        }}
        animate={{
          x: ['-50%', '-70%', '-30%', '-50%'],
          y: ['0%', '15%', '-15%', '0%'],
          rotate: [0, -2, 4, 0],
        }}
        transition={{
          duration: durations.offset,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Layer 3 - Accent wave */}
      <motion.div
        className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%]"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 40% 60%, ${colors[2]}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          x: ['-50%', '-40%', '-60%', '-50%'],
          y: ['0%', '10%', '-10%', '0%'],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: durations.base + 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />
    </div>
  );
}

/**
 * Simpler aurora variant with CSS animations (better performance)
 */
export function AuroraBackgroundCSS({
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  className = '',
  enabled = true,
}: Omit<AuroraBackgroundProps, 'speed' | 'opacity'>) {
  const shouldReduceMotion = useReducedMotion();

  if (!enabled) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
      style={{ opacity: 'var(--aurora-opacity)' }}
    >
      <div
        className={cn(
          'absolute w-[200%] h-[200%] top-[-50%] left-[-50%]',
          !shouldReduceMotion && 'animate-aurora-wave'
        )}
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${colors[0]}40 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        className={cn(
          'absolute w-[200%] h-[200%] top-[-50%] left-[-50%]',
          !shouldReduceMotion && 'animate-aurora-wave-reverse'
        )}
        style={{
          background: `radial-gradient(ellipse 70% 60% at 60% 40%, ${colors[1]}35 0%, transparent 70%)`,
          filter: 'blur(50px)',
          animationDelay: '2s',
        }}
      />
      <div
        className={cn(
          'absolute w-[150%] h-[150%] top-[-25%] left-[-25%]',
          !shouldReduceMotion && 'animate-aurora-wave-slow'
        )}
        style={{
          background: `radial-gradient(ellipse 60% 40% at 40% 60%, ${colors[2]}30 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animationDelay: '4s',
        }}
      />
    </div>
  );
}
