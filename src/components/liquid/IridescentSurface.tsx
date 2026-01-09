/**
 * IridescentSurface Component
 * Color-shifting gradient overlay with hue rotation animation
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

interface IridescentSurfaceProps {
  /** Wrapped content */
  children?: ReactNode;
  /** Effect intensity 0-1 (default: 0.3) */
  intensity?: number;
  /** Animation speed in seconds (default: 10) */
  speed?: number;
  /** Base colors for gradient (default: rainbow) */
  colors?: string[];
  /** Mix blend mode (default: overlay) */
  blendMode?: 'overlay' | 'soft-light' | 'color-dodge' | 'screen';
  /** Additional class names */
  className?: string;
  /** Whether effect is enabled */
  enabled?: boolean;
}

export function IridescentSurface({
  children,
  intensity = 0.3,
  speed = 10,
  colors = ['#ff0080', '#7928ca', '#0070f3', '#00dfd8', '#7928ca', '#ff0080'],
  blendMode = 'overlay',
  className = '',
  enabled = true,
}: IridescentSurfaceProps) {
  const shouldReduceMotion = useReducedMotion();

  const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  // Static version for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{
            background: gradient,
            backgroundSize: '200% 200%',
            opacity: intensity * 0.5,
            mixBlendMode: blendMode,
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background: gradient,
          backgroundSize: '300% 300%',
          opacity: intensity,
          mixBlendMode: blendMode,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

/**
 * Simpler iridescent overlay using CSS hue-rotate
 */
export function IridescentOverlay({
  intensity = 0.25,
  className = '',
  enabled = true,
}: {
  intensity?: number;
  className?: string;
  enabled?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!enabled) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none rounded-[inherit]',
        !shouldReduceMotion && 'animate-color-shift',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #ff008050, #7928ca50, #0070f350, #00dfd850)',
        backgroundSize: '200% 200%',
        opacity: intensity,
        mixBlendMode: 'overlay',
      }}
    />
  );
}

/**
 * Holographic effect variant
 */
export function HolographicSurface({
  children,
  intensity = 0.4,
  className = '',
  enabled = true,
}: {
  children?: ReactNode;
  intensity?: number;
  className?: string;
  enabled?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  const holoGradient = `
    linear-gradient(
      135deg,
      rgba(255, 0, 128, 0.3) 0%,
      rgba(121, 40, 202, 0.3) 25%,
      rgba(0, 112, 243, 0.3) 50%,
      rgba(0, 223, 216, 0.3) 75%,
      rgba(255, 0, 128, 0.3) 100%
    )
  `;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: holoGradient,
          backgroundSize: '400% 400%',
          opacity: intensity,
          mixBlendMode: 'color-dodge',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
              }
        }
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Scan line effect */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(255,255,255,0.03) 50%)',
            backgroundSize: '100% 4px',
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
}
