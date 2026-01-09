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

// ============================================
// Enhanced Liquid Glass v2 Motion Variants
// ============================================

// 3D Tilt hover effect
export const tilt3D: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: LIQUID_EASE,
    },
  },
};

// Neon pulsing glow
export const neonPulse: Variants = {
  initial: {
    boxShadow: '0 0 20px 4px rgba(59, 130, 246, 0.3)',
  },
  animate: {
    boxShadow: [
      '0 0 20px 4px rgba(59, 130, 246, 0.3)',
      '0 0 30px 6px rgba(59, 130, 246, 0.5)',
      '0 0 20px 4px rgba(59, 130, 246, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Floating particle movement
export const floatParticle: Variants = {
  initial: {
    y: 0,
    x: 0,
    opacity: 0.3,
  },
  animate: (custom: number = 0) => ({
    y: [-20, -50, -30, -20],
    x: [0, 15, -10, 0],
    opacity: [0.3, 0.6, 0.4, 0.3],
    transition: {
      duration: 6 + custom * 2,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: custom * 0.5,
    },
  }),
};

// Aurora wave movement
export const auroraShift: Variants = {
  initial: {
    x: '-50%',
    y: 0,
    rotate: 0,
  },
  animate: {
    x: ['-50%', '-30%', '-70%', '-50%'],
    y: [0, -50, 30, 0],
    rotate: [0, 3, -3, 0],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Iridescent color shift
export const iridescent: Variants = {
  initial: {
    filter: 'hue-rotate(0deg)',
  },
  animate: {
    filter: ['hue-rotate(0deg)', 'hue-rotate(30deg)', 'hue-rotate(0deg)'],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Spotlight follow (for cursor spotlight)
export const spotlightVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

// Shimmer slide effect
export const shimmerSlide: Variants = {
  initial: {
    x: '-100%',
    skewX: '-15deg',
  },
  animate: {
    x: '200%',
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatDelay: 2,
    },
  },
};

// Scale pop effect for interactions
export const scalePop: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
  tap: {
    scale: 0.95,
    transition: { type: 'spring', stiffness: 400, damping: 10 },
  },
};

// Glow pulse for buttons/interactive elements
export const glowPulse: Variants = {
  initial: {
    boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
  },
  hover: {
    boxShadow: '0 0 20px 4px rgba(59, 130, 246, 0.4)',
    transition: {
      duration: 0.3,
    },
  },
};

// Device capability check
export function supportsAdvancedEffects(): boolean {
  if (typeof window === 'undefined') return true;

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Check for low-end devices
  const hasLowMemory = 'deviceMemory' in navigator &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

  return !isMobile && !prefersReducedMotion && !hasLowMemory;
}

// Spring configs for different effects
export const springConfigs = {
  gentle: { stiffness: 100, damping: 20 },
  bouncy: { stiffness: 300, damping: 15 },
  stiff: { stiffness: 400, damping: 30 },
  smooth: { stiffness: 200, damping: 25 },
} as const;
