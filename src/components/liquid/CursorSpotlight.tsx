/**
 * CursorSpotlight Component
 * Mouse-following radial gradient glow effect
 */

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface CursorSpotlightProps {
  /** Spotlight color (default: CSS variable) */
  color?: string;
  /** Spotlight size in pixels (default: 300) */
  size?: number;
  /** Glow intensity 0-1 (default: 0.5) */
  intensity?: number;
  /** Whether the spotlight is active (default: true) */
  enabled?: boolean;
  /** Additional class names */
  className?: string;
}

export function CursorSpotlight({
  color = 'var(--spotlight-color)',
  size = 300,
  intensity = 0.5,
  enabled = true,
  className = '',
}: CursorSpotlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed position for fluid movement
  const springConfig = { stiffness: 300, damping: 30 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Opacity for fade in/out
  const opacity = useMotionValue(0);
  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (shouldReduceMotion || !enabled) return;

    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseEnter = () => {
      opacity.set(intensity);
    };

    const handleMouseLeave = () => {
      opacity.set(0);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, opacity, intensity, shouldReduceMotion, enabled]);

  if (shouldReduceMotion || !enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: smoothOpacity,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}

/**
 * Alternative spotlight that stays in container bounds
 */
export function ContainedSpotlight({
  color = 'var(--spotlight-color)',
  size = 250,
  intensity = 0.4,
  enabled = true,
  className = '',
}: CursorSpotlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const smoothX = useSpring(x, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 150, damping: 20 });
  const opacity = useMotionValue(0);
  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 25 });

  useEffect(() => {
    if (shouldReduceMotion || !enabled) return;

    const container = containerRef.current?.parentElement;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const percentX = ((e.clientX - rect.left) / rect.width) * 100;
      const percentY = ((e.clientY - rect.top) / rect.height) * 100;

      x.set(Math.max(0, Math.min(100, percentX)));
      y.set(Math.max(0, Math.min(100, percentY)));
    };

    const handleMouseEnter = () => opacity.set(intensity);
    const handleMouseLeave = () => opacity.set(0);

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, opacity, intensity, shouldReduceMotion, enabled]);

  if (shouldReduceMotion || !enabled) {
    return null;
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute"
        style={{
          width: size,
          height: size,
          left: smoothX.get() + '%',
          top: smoothY.get() + '%',
          x: '-50%',
          y: '-50%',
          opacity: smoothOpacity,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
