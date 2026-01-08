import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to detect if user prefers reduced motion
 * Wraps Framer Motion's useReducedMotion for consistent usage
 * Returns true if animations should be disabled/simplified
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
