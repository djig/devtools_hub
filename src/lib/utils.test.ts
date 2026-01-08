import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('handles empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles single class', () => {
      const result = cn('single');
      expect(result).toBe('single');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('handles false conditionals', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base');
    });

    it('handles undefined values', () => {
      const result = cn('base', undefined, 'other');
      expect(result).toBe('base other');
    });

    it('handles null values', () => {
      const result = cn('base', null, 'other');
      expect(result).toBe('base other');
    });

    it('handles arrays', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles objects', () => {
      const result = cn({ active: true, disabled: false });
      expect(result).toBe('active');
    });

    it('merges tailwind classes correctly', () => {
      // tailwind-merge should handle conflicting classes
      const result = cn('px-2', 'px-4');
      expect(result).toBe('px-4');
    });

    it('merges tailwind padding classes', () => {
      const result = cn('p-2', 'p-4');
      expect(result).toBe('p-4');
    });

    it('merges tailwind margin classes', () => {
      const result = cn('m-2', 'm-4');
      expect(result).toBe('m-4');
    });

    it('merges tailwind text classes', () => {
      const result = cn('text-sm', 'text-lg');
      expect(result).toBe('text-lg');
    });

    it('merges tailwind background classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('preserves non-conflicting classes', () => {
      const result = cn('px-2', 'py-4', 'text-red-500');
      expect(result).toContain('px-2');
      expect(result).toContain('py-4');
      expect(result).toContain('text-red-500');
    });

    it('handles complex mix of values', () => {
      const showConditional = true;
      const hideNotIncluded = false;
      const result = cn(
        'base',
        showConditional && 'conditional',
        hideNotIncluded && 'not-included',
        { active: true, hidden: false },
        ['array-class']
      );
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('not-included');
      expect(result).toContain('active');
      expect(result).not.toContain('hidden');
      expect(result).toContain('array-class');
    });
  });
});
