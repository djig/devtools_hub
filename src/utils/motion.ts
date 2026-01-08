import type { Variants, Transition } from 'framer-motion';

// Standard easing curves
export const LIQUID_EASE = [0.4, 0, 0.2, 1] as const;
export const SPRING_BOUNCE = { type: 'spring', stiffness: 300, damping: 20 } as const;

// Transition presets
export const liquidTransition: Transition = {
  duration: 0.4,
  ease: LIQUID_EASE,
};

export const springTransition: Transition = {
  ...SPRING_BOUNCE,
};

export const fastTransition: Transition = {
  duration: 0.2,
  ease: LIQUID_EASE,
};

// Animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const cardHover: Variants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.02 },
  tap: { scale: 0.98 },
};

export const iconHover: Variants = {
  initial: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 6 },
};

export const glassReveal: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    y: 20,
  },
  animate: {
    opacity: 1,
    backdropFilter: 'blur(24px)',
    y: 0,
    transition: { duration: 0.5, ease: LIQUID_EASE },
  },
};

export const blobFloat: Variants = {
  initial: { scale: 1, x: 0, y: 0 },
  animate: {
    scale: [1, 1.1, 0.95, 1.05, 1],
    x: [0, 30, -15, 15, 0],
    y: [0, -15, 30, -30, 0],
    transition: {
      duration: 25,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// List animation for staggered children
export const listItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

// Slide animations
export const slideInFromLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
};

export const slideInFromRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
};

// Performance utilities
export const MOBILE_BREAKPOINT = 768;

export function shouldAnimateOnDevice(): boolean {
  if (typeof window === 'undefined') return true;

  // Reduce animations on mobile for performance
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  return !isMobile && !prefersReducedMotion;
}

// Simplified animations for mobile
export const mobileOptimizedTransition: Transition = {
  duration: 0.2,
  ease: 'easeOut',
};
