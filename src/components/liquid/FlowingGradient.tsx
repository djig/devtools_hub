import { cn } from '../../lib/utils';
import { useReducedMotion } from 'framer-motion';

interface FlowingGradientProps {
  className?: string;
  colors?: string[];
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'horizontal' | 'diagonal' | 'radial';
}

export function FlowingGradient({
  className,
  colors = ['from-blue-500/10', 'via-purple-500/10', 'to-pink-500/10'],
  speed = 'medium',
  direction = 'diagonal',
}: FlowingGradientProps) {
  const shouldReduceMotion = useReducedMotion();

  const speedDurations: Record<string, string> = {
    slow: '25s',
    medium: '15s',
    fast: '8s',
  };

  const directionClasses: Record<string, string> = {
    horizontal: 'bg-gradient-to-r',
    diagonal: 'bg-gradient-to-br',
    radial:
      'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]',
  };

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        directionClasses[direction],
        colors.join(' '),
        'bg-200%',
        !shouldReduceMotion && 'animate-gradient-shift',
        className
      )}
      style={{
        animationDuration: shouldReduceMotion ? '0s' : speedDurations[speed],
      }}
    />
  );
}
