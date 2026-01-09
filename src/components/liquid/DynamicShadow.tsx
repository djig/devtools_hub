/**
 * DynamicShadow Component
 * Shadow that follows cursor position for depth effect
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type ReactNode, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { cn } from '../../lib/utils';

interface DynamicShadowProps {
  /** Wrapped content */
  children: ReactNode;
  /** Shadow color (default: black) */
  shadowColor?: string;
  /** Maximum shadow offset in pixels (default: 20) */
  maxOffset?: number;
  /** Shadow blur amount in pixels (default: 30) */
  blur?: number;
  /** Shadow spread in pixels (default: 0) */
  spread?: number;
  /** Additional class names */
  className?: string;
  /** Whether effect is enabled */
  enabled?: boolean;
}

export function DynamicShadow({
  children,
  shadowColor = 'rgba(0, 0, 0, 0.3)',
  maxOffset = 20,
  blur = 30,
  spread = 0,
  className = '',
  enabled = true,
}: DynamicShadowProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse position relative to center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed values
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transform mouse position to shadow offset (inverted for natural shadow direction)
  const shadowX = useTransform(smoothX, [-1, 1], [maxOffset, -maxOffset]);
  const shadowY = useTransform(smoothY, [-1, 1], [maxOffset, -maxOffset]);

  // Combined shadow transform - must be called unconditionally
  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([x, y]) => `${x}px ${y}px ${blur}px ${spread}px ${shadowColor}`
  );

  useEffect(() => {
    if (shouldReduceMotion || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized position relative to center (-1 to 1)
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseX.set(Math.max(-1, Math.min(1, normalizedX)));
      mouseY.set(Math.max(-1, Math.min(1, normalizedY)));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, shouldReduceMotion, enabled]);

  // Static shadow for reduced motion or disabled
  if (shouldReduceMotion || !enabled) {
    return (
      <div
        className={cn('relative', className)}
        style={{
          boxShadow: `0 ${maxOffset / 2}px ${blur}px ${spread}px ${shadowColor}`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ boxShadow }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Colored dynamic shadow (for cards with gradient borders)
 */
export function ColoredDynamicShadow({
  children,
  color = '#3b82f6',
  secondaryColor,
  maxOffset = 15,
  blur = 25,
  intensity = 0.4,
  className = '',
  enabled = true,
}: {
  children: ReactNode;
  color?: string;
  secondaryColor?: string;
  maxOffset?: number;
  blur?: number;
  intensity?: number;
  className?: string;
  enabled?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion || !enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const normalizedX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, shouldReduceMotion, enabled]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const primaryShadow = hexToRgba(color, intensity);
  const secondShadow = secondaryColor ? hexToRgba(secondaryColor, intensity * 0.6) : primaryShadow;

  // Combined shadow transform - must be called unconditionally
  const boxShadow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => {
      const offsetX = (x as number) * maxOffset;
      const offsetY = (y as number) * maxOffset;
      return `${offsetX}px ${offsetY}px ${blur}px ${primaryShadow}, ${offsetX * 0.5}px ${offsetY * 0.5}px ${blur * 1.5}px ${secondShadow}`;
    }
  );

  if (shouldReduceMotion || !enabled) {
    return (
      <div
        className={cn('relative', className)}
        style={{
          boxShadow: `0 ${maxOffset / 2}px ${blur}px ${primaryShadow}`,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ boxShadow }}
    >
      {children}
    </motion.div>
  );
}
