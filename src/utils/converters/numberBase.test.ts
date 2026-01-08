import { describe, it, expect } from 'vitest';
import {
  decimalToBinary,
  decimalToOctal,
  decimalToHex,
  binaryToDecimal,
  octalToDecimal,
  hexToDecimal,
  convertBase,
} from './numberBase';

describe('numberBase', () => {
  describe('decimalToBinary', () => {
    it('converts 0', () => {
      expect(decimalToBinary(0)).toBe('0');
    });

    it('converts 1', () => {
      expect(decimalToBinary(1)).toBe('1');
    });

    it('converts 10', () => {
      expect(decimalToBinary(10)).toBe('1010');
    });

    it('converts 255', () => {
      expect(decimalToBinary(255)).toBe('11111111');
    });

    it('converts large numbers', () => {
      expect(decimalToBinary(1024)).toBe('10000000000');
    });
  });

  describe('decimalToOctal', () => {
    it('converts 0', () => {
      expect(decimalToOctal(0)).toBe('0');
    });

    it('converts 8', () => {
      expect(decimalToOctal(8)).toBe('10');
    });

    it('converts 64', () => {
      expect(decimalToOctal(64)).toBe('100');
    });

    it('converts 255', () => {
      expect(decimalToOctal(255)).toBe('377');
    });
  });

  describe('decimalToHex', () => {
    it('converts 0', () => {
      expect(decimalToHex(0)).toBe('0');
    });

    it('converts 15', () => {
      expect(decimalToHex(15)).toBe('F');
    });

    it('converts 16', () => {
      expect(decimalToHex(16)).toBe('10');
    });

    it('converts 255', () => {
      expect(decimalToHex(255)).toBe('FF');
    });

    it('converts 4096', () => {
      expect(decimalToHex(4096)).toBe('1000');
    });

    it('returns uppercase', () => {
      expect(decimalToHex(171)).toBe('AB');
    });
  });

  describe('binaryToDecimal', () => {
    it('converts 0', () => {
      expect(binaryToDecimal('0')).toBe(0);
    });

    it('converts 1', () => {
      expect(binaryToDecimal('1')).toBe(1);
    });

    it('converts 1010', () => {
      expect(binaryToDecimal('1010')).toBe(10);
    });

    it('converts 11111111', () => {
      expect(binaryToDecimal('11111111')).toBe(255);
    });
  });

  describe('octalToDecimal', () => {
    it('converts 0', () => {
      expect(octalToDecimal('0')).toBe(0);
    });

    it('converts 10', () => {
      expect(octalToDecimal('10')).toBe(8);
    });

    it('converts 377', () => {
      expect(octalToDecimal('377')).toBe(255);
    });
  });

  describe('hexToDecimal', () => {
    it('converts 0', () => {
      expect(hexToDecimal('0')).toBe(0);
    });

    it('converts F', () => {
      expect(hexToDecimal('F')).toBe(15);
    });

    it('converts FF', () => {
      expect(hexToDecimal('FF')).toBe(255);
    });

    it('handles lowercase', () => {
      expect(hexToDecimal('ff')).toBe(255);
    });

    it('converts 1000', () => {
      expect(hexToDecimal('1000')).toBe(4096);
    });
  });

  describe('convertBase', () => {
    it('converts from decimal base 10', () => {
      const result = convertBase('255', 10);
      expect(result.decimal).toBe('255');
      expect(result.binary).toBe('11111111');
      expect(result.octal).toBe('377');
      expect(result.hex).toBe('FF');
    });

    it('converts from binary base 2', () => {
      const result = convertBase('1010', 2);
      expect(result.decimal).toBe('10');
      expect(result.binary).toBe('1010');
      expect(result.octal).toBe('12');
      expect(result.hex).toBe('A');
    });

    it('converts from octal base 8', () => {
      const result = convertBase('377', 8);
      expect(result.decimal).toBe('255');
      expect(result.binary).toBe('11111111');
      expect(result.octal).toBe('377');
      expect(result.hex).toBe('FF');
    });

    it('converts from hex base 16', () => {
      const result = convertBase('FF', 16);
      expect(result.decimal).toBe('255');
      expect(result.binary).toBe('11111111');
      expect(result.octal).toBe('377');
      expect(result.hex).toBe('FF');
    });

    it('converts 0', () => {
      const result = convertBase('0', 10);
      expect(result.decimal).toBe('0');
      expect(result.binary).toBe('0');
      expect(result.octal).toBe('0');
      expect(result.hex).toBe('0');
    });

    it('throws error for invalid number', () => {
      expect(() => convertBase('GGG', 16)).toThrow();
      expect(() => convertBase('abc', 10)).toThrow();
      expect(() => convertBase('222', 2)).toThrow();
    });
  });

  describe('roundtrip conversions', () => {
    const testNumbers = [0, 1, 10, 42, 100, 255, 1000, 65535];

    testNumbers.forEach((num) => {
      it(`roundtrip for ${num}`, () => {
        const binary = decimalToBinary(num);
        const octal = decimalToOctal(num);
        const hex = decimalToHex(num);

        expect(binaryToDecimal(binary)).toBe(num);
        expect(octalToDecimal(octal)).toBe(num);
        expect(hexToDecimal(hex)).toBe(num);
      });
    });
  });
});
