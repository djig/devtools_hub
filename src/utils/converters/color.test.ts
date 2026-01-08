import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './color';

describe('color', () => {
  describe('hexToRgb', () => {
    it('converts black', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts white', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts red', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('converts green', () => {
      expect(hexToRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('converts blue', () => {
      expect(hexToRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('handles hex without #', () => {
      expect(hexToRgb('ff5500')).toEqual({ r: 255, g: 85, b: 0 });
    });

    it('handles uppercase hex', () => {
      expect(hexToRgb('#FF5500')).toEqual({ r: 255, g: 85, b: 0 });
    });

    it('throws error for invalid hex', () => {
      expect(() => hexToRgb('invalid')).toThrow('Invalid hex color');
      expect(() => hexToRgb('#fff')).toThrow('Invalid hex color');
      expect(() => hexToRgb('#gggggg')).toThrow('Invalid hex color');
    });
  });

  describe('rgbToHex', () => {
    it('converts black', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
    });

    it('converts white', () => {
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
    });

    it('converts red', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });

    it('converts green', () => {
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    });

    it('converts blue', () => {
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    it('converts mixed colors', () => {
      expect(rgbToHex(255, 85, 0)).toBe('#ff5500');
    });

    it('pads single digit hex values', () => {
      expect(rgbToHex(1, 2, 3)).toBe('#010203');
    });
  });

  describe('rgbToHsl', () => {
    it('converts black', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('converts white', () => {
      expect(rgbToHsl(255, 255, 255)).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('converts red', () => {
      expect(rgbToHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('converts green', () => {
      expect(rgbToHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 });
    });

    it('converts blue', () => {
      expect(rgbToHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 });
    });

    it('converts gray', () => {
      expect(rgbToHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 });
    });
  });

  describe('hslToRgb', () => {
    it('converts black', () => {
      expect(hslToRgb(0, 0, 0)).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('converts white', () => {
      expect(hslToRgb(0, 0, 100)).toEqual({ r: 255, g: 255, b: 255 });
    });

    it('converts red', () => {
      expect(hslToRgb(0, 100, 50)).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('converts green', () => {
      expect(hslToRgb(120, 100, 50)).toEqual({ r: 0, g: 255, b: 0 });
    });

    it('converts blue', () => {
      expect(hslToRgb(240, 100, 50)).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('converts gray (zero saturation)', () => {
      expect(hslToRgb(0, 0, 50)).toEqual({ r: 128, g: 128, b: 128 });
    });

    it('converts cyan', () => {
      expect(hslToRgb(180, 100, 50)).toEqual({ r: 0, g: 255, b: 255 });
    });

    it('converts magenta', () => {
      expect(hslToRgb(300, 100, 50)).toEqual({ r: 255, g: 0, b: 255 });
    });

    it('converts yellow', () => {
      expect(hslToRgb(60, 100, 50)).toEqual({ r: 255, g: 255, b: 0 });
    });
  });

  describe('roundtrip conversions', () => {
    const testCases = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 128, g: 128, b: 128 },
      { r: 255, g: 128, b: 64 },
    ];

    testCases.forEach(({ r, g, b }) => {
      it(`hex roundtrip for rgb(${r}, ${g}, ${b})`, () => {
        const hex = rgbToHex(r, g, b);
        const rgb = hexToRgb(hex);
        expect(rgb).toEqual({ r, g, b });
      });
    });
  });
});
