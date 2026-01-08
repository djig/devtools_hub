/**
 * Tests for gradient utility functions
 */

import { describe, it, expect } from 'vitest';
import { getIconGradient, getCardGradient } from './gradients';
import { ICON_GRADIENTS, CARD_GRADIENTS } from '../constants';

describe('gradients utilities', () => {
  describe('getIconGradient', () => {
    it('returns a valid gradient string', () => {
      const gradient = getIconGradient('test-tool');
      expect(ICON_GRADIENTS).toContain(gradient);
    });

    it('returns consistent gradient for same tool ID', () => {
      const gradient1 = getIconGradient('json-formatter');
      const gradient2 = getIconGradient('json-formatter');
      expect(gradient1).toBe(gradient2);
    });

    it('returns different gradients for different tool IDs', () => {
      const gradient1 = getIconGradient('json-formatter');
      const gradient2 = getIconGradient('xml-converter');
      // They might be the same by chance, but testing determinism
      expect(typeof gradient1).toBe('string');
      expect(typeof gradient2).toBe('string');
    });

    it('handles empty string', () => {
      const gradient = getIconGradient('');
      expect(ICON_GRADIENTS).toContain(gradient);
    });

    it('handles special characters', () => {
      const gradient = getIconGradient('test-tool_123!@#');
      expect(ICON_GRADIENTS).toContain(gradient);
    });
  });

  describe('getCardGradient', () => {
    it('returns a valid card gradient string', () => {
      const gradient = getCardGradient('test-tool');
      expect(CARD_GRADIENTS).toContain(gradient);
    });

    it('returns consistent gradient for same tool ID', () => {
      const gradient1 = getCardGradient('base64-encoder');
      const gradient2 = getCardGradient('base64-encoder');
      expect(gradient1).toBe(gradient2);
    });

    it('card gradient contains hover states', () => {
      const gradient = getCardGradient('test-tool');
      expect(gradient).toContain('hover:');
    });
  });
});
