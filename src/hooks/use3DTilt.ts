/**
 * Hook for 3D tilt effect based on cursor position
 * Creates perspective transforms for cards and interactive elements
 */

import { useState, useCallback, type CSSProperties } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TiltStyle extends CSSProperties {
  transform: string;
  transition: string;
}

export interface Use3DTiltOptions {
  /** Maximum tilt angle in degrees (default: 15) */
  maxTilt?: number;
  /** Perspective distance in pixels (default: 1000) */
  perspective?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Transition speed in ms (default: 400) */
  speed?: number;
  /** Enable/disable the glare effect (default: false) */
  glare?: boolean;
  /** Maximum glare opacity (default: 0.3) */
  glareOpacity?: number;
}

export interface Use3DTiltReturn {
  style: TiltStyle;
  glareStyle: CSSProperties;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

const defaultStyle: TiltStyle = {
  transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
  transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
};

const defaultGlareStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  background: 'transparent',
  opacity: 0,
};

/**
 * Create 3D tilt effect for interactive elements
 * @param options - Configuration options for the tilt effect
 * @returns Style object and event handlers
 */
export function use3DTilt({
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  speed = 400,
  glare = false,
  glareOpacity = 0.3,
}: Use3DTiltOptions = {}): Use3DTiltReturn {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [style, setStyle] = useState<TiltStyle>({
    ...defaultStyle,
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  });
  const [glareStyle, setGlareStyle] = useState<CSSProperties>(defaultGlareStyle);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (shouldReduceMotion) return;

      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate tilt angles
      const rotateY = ((x / rect.width - 0.5) * maxTilt * 2);
      const rotateX = ((y / rect.height - 0.5) * -maxTilt * 2);

      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: 'transform 50ms ease-out',
      });

      // Update glare position
      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        setGlareStyle({
          ...defaultGlareStyle,
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
          opacity: 1,
        });
      }
    },
    [maxTilt, perspective, scale, shouldReduceMotion, glare, glareOpacity]
  );

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    setStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition: `transform ${speed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    });
    if (glare) {
      setGlareStyle(defaultGlareStyle);
    }
  }, [perspective, speed, glare]);

  if (shouldReduceMotion) {
    return {
      style: defaultStyle,
      glareStyle: defaultGlareStyle,
      onMouseMove: () => {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      isHovered: false,
    };
  }

  return {
    style,
    glareStyle,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    isHovered,
  };
}
