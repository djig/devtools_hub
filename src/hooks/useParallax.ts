/**
 * Hook for scroll-based parallax effects
 * Uses Framer Motion's useScroll for smooth, performant parallax
 */

import { useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { useRef, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface ParallaxOptions {
  /** Speed multiplier (default: 0.5). Positive = same direction, negative = opposite */
  speed?: number;
  /** Offset range in pixels (default: [-100, 100]) */
  offset?: [number, number];
  /** Scroll progress range (default: [0, 1]) */
  inputRange?: [number, number];
  /** Enable spring smoothing (default: true) */
  smooth?: boolean;
  /** Spring stiffness (default: 100) */
  stiffness?: number;
  /** Spring damping (default: 30) */
  damping?: number;
}

interface ParallaxReturn {
  /** Ref to attach to the container element */
  ref: RefObject<HTMLDivElement | null>;
  /** Y translation value (motion value) */
  y: MotionValue<number>;
  /** X translation value (motion value) */
  x: MotionValue<number>;
  /** Opacity value based on scroll (motion value) */
  opacity: MotionValue<number>;
  /** Scale value based on scroll (motion value) */
  scale: MotionValue<number>;
  /** Scroll progress (0 to 1) */
  progress: MotionValue<number>;
}

/**
 * Create scroll-based parallax effects
 * @param options - Configuration options for parallax behavior
 * @returns Motion values and ref for parallax animations
 */
export function useParallax({
  speed = 0.5,
  offset = [-100, 100],
  inputRange = [0, 1],
  smooth = true,
  stiffness = 100,
  damping = 30,
}: ParallaxOptions = {}): ParallaxReturn {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate Y offset based on speed
  const yOffset = offset.map((o) => o * speed) as [number, number];
  const rawY = useTransform(scrollYProgress, inputRange, yOffset);

  // Calculate X offset (half the speed for subtle horizontal movement)
  const xOffset = offset.map((o) => o * speed * 0.3) as [number, number];
  const rawX = useTransform(scrollYProgress, inputRange, xOffset);

  // Opacity: fade in as element enters view
  const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Scale: subtle zoom effect
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.95, 1, 0.95]
  );

  // Apply spring smoothing
  const springConfig = { stiffness, damping };
  const y = useSpring(rawY, smooth ? springConfig : { stiffness: 1000, damping: 100 });
  const x = useSpring(rawX, smooth ? springConfig : { stiffness: 1000, damping: 100 });
  const opacity = useSpring(rawOpacity, { stiffness: 200, damping: 40 });
  const scale = useSpring(rawScale, { stiffness: 200, damping: 40 });

  // Return static values if reduced motion is preferred
  if (shouldReduceMotion) {
    return {
      ref,
      y: { get: () => 0, set: () => {} } as unknown as MotionValue<number>,
      x: { get: () => 0, set: () => {} } as unknown as MotionValue<number>,
      opacity: { get: () => 1, set: () => {} } as unknown as MotionValue<number>,
      scale: { get: () => 1, set: () => {} } as unknown as MotionValue<number>,
      progress: scrollYProgress,
    };
  }

  return {
    ref,
    y,
    x,
    opacity,
    scale,
    progress: scrollYProgress,
  };
}

/**
 * Simplified parallax for just Y-axis movement
 */
export function useSimpleParallax(speed: number = 0.5): {
  ref: RefObject<HTMLDivElement | null>;
  style: { y: MotionValue<number> };
} {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-50 * speed, 50 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  if (shouldReduceMotion) {
    return {
      ref,
      style: { y: { get: () => 0, set: () => {} } as unknown as MotionValue<number> },
    };
  }

  return {
    ref,
    style: { y: smoothY },
  };
}
