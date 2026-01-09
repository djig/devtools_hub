/**
 * MultiLayerShimmer Component
 * Multiple shimmer layers at different speeds and angles
 */

import { motion } from 'framer-motion';
import { type ReactNode, useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

interface ShimmerLayer {
  angle: number;
  duration: number;
  delay: number;
  opacity: number;
  width: string;
}

interface MultiLayerShimmerProps {
  /** Wrapped content */
  children?: ReactNode;
  /** Number of shimmer layers (default: 3) */
  layers?: number;
  /** Shimmer color (default: white) */
  color?: string;
  /** Base duration in seconds (default: 2) */
  baseDuration?: number;
  /** Additional class names */
  className?: string;
  /** Whether shimmer is enabled */
  enabled?: boolean;
}

export function MultiLayerShimmer({
  children,
  layers = 3,
  color = 'rgba(255, 255, 255, 0.3)',
  baseDuration = 2,
  className = '',
  enabled = true,
}: MultiLayerShimmerProps) {
  const shouldReduceMotion = useReducedMotion();

  // Generate layer configurations
  const shimmerLayers = useMemo<ShimmerLayer[]>(() => {
    return Array.from({ length: layers }, (_, i) => ({
      angle: -15 + i * 10, // Vary angles: -15, -5, 5
      duration: baseDuration + i * 0.5, // Vary speeds: 2s, 2.5s, 3s
      delay: i * 0.3, // Stagger start times
      opacity: 0.3 - i * 0.05, // Decrease opacity for background layers
      width: `${50 + i * 20}%`, // Vary widths: 50%, 70%, 90%
    }));
  }, [layers, baseDuration]);

  if (!enabled || shouldReduceMotion) {
    return <div className={cn('relative overflow-hidden', className)}>{children}</div>;
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}

      {/* Shimmer layers */}
      {shimmerLayers.map((layer, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              ${layer.angle}deg,
              transparent 0%,
              transparent 40%,
              ${color} 50%,
              transparent 60%,
              transparent 100%
            )`,
            width: layer.width,
            opacity: layer.opacity,
          }}
          animate={{
            x: ['-100%', '300%'],
          }}
          transition={{
            duration: layer.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: layer.delay,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Single shimmer effect (simpler, more performant)
 */
export function Shimmer({
  color = 'rgba(255, 255, 255, 0.2)',
  duration = 2,
  angle = -15,
  className = '',
  enabled = true,
}: {
  color?: string;
  duration?: number;
  angle?: number;
  className?: string;
  enabled?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!enabled || shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatDelay: 2,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            ${angle}deg,
            transparent 0%,
            transparent 40%,
            ${color} 50%,
            transparent 60%,
            transparent 100%
          )`,
          transform: `skewX(${angle}deg)`,
        }}
      />
    </motion.div>
  );
}

/**
 * CSS-only shimmer using Tailwind animation class
 */
export function ShimmerCSS({
  className = '',
  enabled = true,
}: {
  className?: string;
  enabled?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!enabled || shouldReduceMotion) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]',
        className
      )}
    >
      <div
        className="absolute inset-0 animate-shimmer-slide"
        style={{
          background: `linear-gradient(
            -15deg,
            transparent 0%,
            transparent 40%,
            var(--shimmer-color) 50%,
            transparent 60%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}

/**
 * Skeleton shimmer for loading states
 */
export function SkeletonShimmer({
  width = '100%',
  height = '1rem',
  rounded = 'md',
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        roundedClass,
        className
      )}
      style={{ width, height }}
    >
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}
