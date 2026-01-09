import { LiquidBlob } from './LiquidBlob';
import { AuroraBackground } from './AuroraBackground';
import { ParticleField } from './ParticleField';
import { cn } from '../../lib/utils';

interface LiquidBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'hero' | 'card' | 'page';
  colorScheme?: 'primary' | 'accent' | 'gradient';
  /** Enable aurora effect (default: false) */
  aurora?: boolean;
  /** Aurora colors (optional) */
  auroraColors?: string[];
  /** Enable floating particles (default: false) */
  particles?: boolean;
  /** Number of particles (default: 30) */
  particleCount?: number;
  /** Enable parallax effect (default: false) */
  parallax?: boolean;
}

const colorSchemes = {
  primary: {
    blob1: { color1: 'from-blue-500/20', color2: 'to-cyan-500/20' },
    blob2: { color1: 'from-purple-500/20', color2: 'to-pink-500/20' },
    blob3: { color1: 'from-indigo-500/15', color2: 'to-blue-500/15' },
  },
  accent: {
    blob1: { color1: 'from-pink-500/20', color2: 'to-rose-500/20' },
    blob2: { color1: 'from-orange-500/20', color2: 'to-amber-500/20' },
    blob3: { color1: 'from-red-500/15', color2: 'to-pink-500/15' },
  },
  gradient: {
    blob1: { color1: 'from-blue-500/20', color2: 'to-purple-500/20' },
    blob2: { color1: 'from-green-500/20', color2: 'to-teal-500/20' },
    blob3: { color1: 'from-pink-500/15', color2: 'to-orange-500/15' },
  },
};

// Aurora color presets based on color scheme
const auroraPresets = {
  primary: ['#3b82f6', '#8b5cf6', '#06b6d4'],
  accent: ['#ec4899', '#f97316', '#ef4444'],
  gradient: ['#3b82f6', '#10b981', '#8b5cf6'],
};

export function LiquidBackground({
  children,
  className,
  variant = 'page',
  colorScheme = 'primary',
  aurora = false,
  auroraColors,
  particles = false,
  particleCount = 30,
}: LiquidBackgroundProps) {
  const colors = colorSchemes[colorScheme];
  const defaultAuroraColors = auroraColors || auroraPresets[colorScheme];

  const variantConfig = {
    hero: {
      blobCount: 3,
      blobSize: 'xl' as const,
      intensity: 'high' as const,
    },
    card: { blobCount: 2, blobSize: 'md' as const, intensity: 'low' as const },
    page: {
      blobCount: 3,
      blobSize: 'lg' as const,
      intensity: 'medium' as const,
    },
  };

  const { blobCount, blobSize, intensity } = variantConfig[variant];

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Aurora layer (z-0) */}
      {aurora && (
        <AuroraBackground
          colors={defaultAuroraColors}
          speed={variant === 'hero' ? 'slow' : 'medium'}
          className="z-0"
        />
      )}

      {/* Blob layer (z-10) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <LiquidBlob
          {...colors.blob1}
          size={blobSize}
          delay={0}
          intensity={intensity}
          className="-top-20 -left-20"
        />
        {blobCount >= 2 && (
          <LiquidBlob
            {...colors.blob2}
            size={blobSize}
            delay={5}
            intensity={intensity}
            className="-bottom-20 -right-20"
          />
        )}
        {blobCount >= 3 && (
          <LiquidBlob
            {...colors.blob3}
            size={blobSize === 'xl' ? 'lg' : 'sm'}
            delay={10}
            intensity={intensity}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>

      {/* Particle layer (z-20) */}
      {particles && (
        <ParticleField
          count={particleCount}
          className="z-20"
        />
      )}

      {/* Content layer (z-30) */}
      <div className="relative z-30">{children}</div>
    </div>
  );
}
