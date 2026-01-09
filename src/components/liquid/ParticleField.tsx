/**
 * ParticleField Component
 * Floating particles with random positions and animations
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { floatParticle } from '../../utils/motion';

interface ParticleFieldProps {
  /** Number of particles (default: 30, mobile: 15) */
  count?: number;
  /** Particle color (default: CSS variable) */
  color?: string;
  /** Minimum particle size in pixels (default: 2) */
  minSize?: number;
  /** Maximum particle size in pixels (default: 6) */
  maxSize?: number;
  /** Additional class names */
  className?: string;
  /** Whether particles are enabled */
  enabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function ParticleField({
  count = 30,
  color = 'var(--particle-color)',
  minSize = 2,
  maxSize = 6,
  className = '',
  enabled = true,
}: ParticleFieldProps) {
  const shouldReduceMotion = useReducedMotion();

  // Generate particles with random properties
  const particles = useMemo<Particle[]>(() => {
    // Reduce count on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? Math.floor(count / 2) : count;

    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, [count, minSize, maxSize]);

  if (shouldReduceMotion || !enabled) {
    // Return static particles for reduced motion
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {particles.slice(0, 10).map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
              opacity: particle.opacity * 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
          }}
          variants={floatParticle}
          initial="initial"
          animate="animate"
          custom={particle.delay}
        />
      ))}
    </div>
  );
}

/**
 * Sparkle variant with brief flashes
 */
export function SparkleField({
  count = 20,
  color = 'rgba(255, 255, 255, 0.8)',
  className = '',
}: {
  count?: number;
  color?: string;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  const sparkles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, [count]);

  if (shouldReduceMotion) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: color,
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.size}px ${color}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
