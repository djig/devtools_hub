/**
 * TiltCard Component
 * 3D perspective tilt on hover with optional glare effect
 */

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { use3DTilt } from '../../hooks/use3DTilt';
import { cn } from '../../lib/utils';

interface TiltCardProps {
  /** Card content */
  children: ReactNode;
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Transition speed in ms (default: 400) */
  speed?: number;
  /** Enable glare effect (default: true) */
  glareEnabled?: boolean;
  /** Glare color (default: white with 0.3 opacity) */
  glareColor?: string;
  /** Additional class names */
  className?: string;
  /** Whether to apply glass styling */
  glass?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function TiltCard({
  children,
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glareEnabled = true,
  glareColor = 'rgba(255, 255, 255, 0.3)',
  className = '',
  glass = false,
  onClick,
}: TiltCardProps) {
  const {
    style,
    glareStyle,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
  } = use3DTilt({
    maxTilt,
    perspective,
    scale,
    speed,
    glare: glareEnabled,
    glareOpacity: 0.3,
  });

  return (
    <motion.div
      className={cn(
        'relative preserve-3d cursor-pointer',
        glass && 'liquid-glass rounded-xl',
        className
      )}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {children}

      {/* Glare overlay */}
      {glareEnabled && (
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
          style={{
            ...glareStyle,
            background: glareStyle.background || `radial-gradient(circle at 50% 50%, ${glareColor} 0%, transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}

/**
 * Simplified tilt wrapper without extra styling
 */
export function TiltWrapper({
  children,
  maxTilt = 10,
  className = '',
}: {
  children: ReactNode;
  maxTilt?: number;
  className?: string;
}) {
  const { style, onMouseMove, onMouseEnter, onMouseLeave } = use3DTilt({
    maxTilt,
    glare: false,
  });

  return (
    <div
      className={cn('preserve-3d', className)}
      style={style}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
