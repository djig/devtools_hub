/**
 * Hook for tracking mouse position
 * Provides global or element-relative mouse coordinates
 */

import { useState, useEffect, useCallback, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
  isInside: boolean;
}

const defaultPosition: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
  isInside: false,
};

/**
 * Track mouse position globally or relative to an element
 * @param ref - Optional ref to track position relative to an element
 * @returns Mouse position with normalized coordinates
 */
export function useMousePosition(ref?: RefObject<HTMLElement>): MousePosition {
  const shouldReduceMotion = useReducedMotion();
  const [position, setPosition] = useState<MousePosition>(defaultPosition);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (shouldReduceMotion) return;

      const element = ref?.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

        setPosition({
          x,
          y,
          normalizedX: (x / rect.width) * 2 - 1,
          normalizedY: (y / rect.height) * 2 - 1,
          isInside,
        });
      } else {
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
          normalizedY: (e.clientY / window.innerHeight) * 2 - 1,
          isInside: true,
        });
      }
    },
    [ref, shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    if (ref?.current) {
      setPosition((prev) => ({ ...prev, isInside: false }));
    }
  }, [ref]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const element = ref?.current;
    const target = element || window;

    target.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    if (element) {
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      target.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (element) {
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleMouseMove, handleMouseLeave, ref, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return defaultPosition;
  }

  return position;
}
