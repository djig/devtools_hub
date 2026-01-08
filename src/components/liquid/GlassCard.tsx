import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  depth?: 1 | 2 | 3;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  depth = 2,
  hover = true,
  glow = false,
  glowColor = 'primary',
  onClick,
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const glowColors: Record<string, string> = {
    primary: 'shadow-primary/20 hover:shadow-primary/40',
    blue: 'shadow-blue-500/20 hover:shadow-blue-500/40',
    purple: 'shadow-purple-500/20 hover:shadow-purple-500/40',
    pink: 'shadow-pink-500/20 hover:shadow-pink-500/40',
  };

  const baseClasses = cn(
    'relative rounded-2xl overflow-hidden',
    'bg-white/30 dark:bg-black/20',
    'backdrop-blur-2xl',
    'border border-white/20 dark:border-white/10',
    hover && 'transition-all duration-400',
    hover &&
      !shouldReduceMotion &&
      'hover:-translate-y-1 hover:scale-[1.02]',
    glow && `shadow-xl ${glowColors[glowColor] || glowColors.primary}`,
    className
  );

  const content = (
    <>
      {/* Base glass layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Mid-depth layer for depth >= 2 */}
      {depth >= 2 && (
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      )}

      {/* Deep refraction layer for depth >= 3 */}
      {depth >= 3 && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-400 pointer-events-none rounded-2xl" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </>
  );

  if (shouldReduceMotion || !hover) {
    return (
      <div className={cn(baseClasses, 'group')} onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(baseClasses, 'group')}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
    >
      {content}
    </motion.div>
  );
}
