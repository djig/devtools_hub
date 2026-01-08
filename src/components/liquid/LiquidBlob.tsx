import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LiquidBlobProps {
  className?: string;
  color1?: string;
  color2?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
  intensity?: 'low' | 'medium' | 'high';
}

const sizeMap = {
  sm: 'w-48 h-48',
  md: 'w-72 h-72',
  lg: 'w-96 h-96',
  xl: 'w-[500px] h-[500px]',
};

export function LiquidBlob({
  className,
  color1 = 'from-blue-500/30',
  color2 = 'to-purple-500/30',
  size = 'md',
  delay = 0,
  intensity = 'medium',
}: LiquidBlobProps) {
  const shouldReduceMotion = useReducedMotion();

  const intensityScale = {
    low: { x: 10, y: 10, rotate: 5 },
    medium: { x: 30, y: 30, rotate: 15 },
    high: { x: 50, y: 50, rotate: 25 },
  };

  const { x, y, rotate } = intensityScale[intensity];

  if (shouldReduceMotion) {
    return (
      <div
        className={cn(
          'absolute rounded-full blur-3xl opacity-50',
          `bg-gradient-to-br ${color1} ${color2}`,
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        'absolute rounded-full blur-3xl opacity-50',
        `bg-gradient-to-br ${color1} ${color2}`,
        sizeMap[size],
        'animate-blob-morph',
        className
      )}
      animate={{
        x: [0, x, -x / 2, x / 2, 0],
        y: [0, -y / 2, y, -y, 0],
        rotate: [0, rotate, -rotate, rotate / 2, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 25 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    />
  );
}
