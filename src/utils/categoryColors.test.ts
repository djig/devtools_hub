import { describe, it, expect } from 'vitest';
import { categoryColors, getCategoryColors } from './categoryColors';

describe('categoryColors', () => {
  describe('categoryColors object', () => {
    const categories = [
      'formatters',
      'converters',
      'encoders',
      'text',
      'generators',
      'datetime',
      'calculators',
      'developer',
      'network',
    ] as const;

    categories.forEach((category) => {
      it(`has colors for ${category}`, () => {
        expect(categoryColors[category]).toBeDefined();
        expect(categoryColors[category].iconBg).toBeDefined();
        expect(categoryColors[category].iconText).toBeDefined();
        expect(categoryColors[category].badge).toBeDefined();
        expect(categoryColors[category].gradientFrom).toBeDefined();
        expect(categoryColors[category].gradientTo).toBeDefined();
      });
    });

    it('has 9 categories', () => {
      expect(Object.keys(categoryColors)).toHaveLength(9);
    });

    it('all categories have gradient backgrounds', () => {
      Object.values(categoryColors).forEach((colors) => {
        expect(colors.iconBg).toContain('bg-gradient');
      });
    });

    it('all categories have text colors', () => {
      Object.values(categoryColors).forEach((colors) => {
        expect(colors.iconText).toContain('text-');
      });
    });
  });

  describe('getCategoryColors', () => {
    it('returns colors for formatters', () => {
      const colors = getCategoryColors('formatters');
      expect(colors).toBe(categoryColors.formatters);
    });

    it('returns colors for converters', () => {
      const colors = getCategoryColors('converters');
      expect(colors).toBe(categoryColors.converters);
    });

    it('returns colors for encoders', () => {
      const colors = getCategoryColors('encoders');
      expect(colors).toBe(categoryColors.encoders);
    });

    it('returns colors for text', () => {
      const colors = getCategoryColors('text');
      expect(colors).toBe(categoryColors.text);
    });

    it('returns colors for generators', () => {
      const colors = getCategoryColors('generators');
      expect(colors).toBe(categoryColors.generators);
    });

    it('returns colors for datetime', () => {
      const colors = getCategoryColors('datetime');
      expect(colors).toBe(categoryColors.datetime);
    });

    it('returns colors for calculators', () => {
      const colors = getCategoryColors('calculators');
      expect(colors).toBe(categoryColors.calculators);
    });

    it('returns colors for developer', () => {
      const colors = getCategoryColors('developer');
      expect(colors).toBe(categoryColors.developer);
    });

    it('returns colors for network', () => {
      const colors = getCategoryColors('network');
      expect(colors).toBe(categoryColors.network);
    });

    it('returns default colors for unknown category', () => {
      // @ts-expect-error Testing fallback behavior
      const colors = getCategoryColors('unknown');
      expect(colors).toBe(categoryColors.formatters);
    });
  });
});
