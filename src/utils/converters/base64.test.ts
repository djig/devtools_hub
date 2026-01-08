import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64, isValidBase64 } from './base64';

describe('base64', () => {
  describe('encodeBase64', () => {
    it('encodes simple ASCII text', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    });

    it('encodes empty string', () => {
      expect(encodeBase64('')).toBe('');
    });

    it('encodes special characters', () => {
      expect(encodeBase64('Hello & Goodbye')).toBe('SGVsbG8gJiBHb29kYnll');
    });

    it('encodes unicode characters', () => {
      const encoded = encodeBase64('Hello 世界');
      expect(encoded).toBeTruthy();
      expect(decodeBase64(encoded)).toBe('Hello 世界');
    });

    it('encodes numbers', () => {
      expect(encodeBase64('12345')).toBe('MTIzNDU=');
    });

    it('encodes JSON string', () => {
      const json = '{"name":"test"}';
      const encoded = encodeBase64(json);
      expect(decodeBase64(encoded)).toBe(json);
    });
  });

  describe('decodeBase64', () => {
    it('decodes simple ASCII text', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    });

    it('decodes empty string', () => {
      expect(decodeBase64('')).toBe('');
    });

    it('decodes special characters', () => {
      expect(decodeBase64('SGVsbG8gJiBHb29kYnll')).toBe('Hello & Goodbye');
    });

    it('throws error for invalid base64', () => {
      expect(() => decodeBase64('not-valid-base64!!!')).toThrow();
    });

    it('decodes numbers', () => {
      expect(decodeBase64('MTIzNDU=')).toBe('12345');
    });
  });

  describe('isValidBase64', () => {
    it('returns true for valid base64', () => {
      expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
    });

    it('returns true for empty string', () => {
      expect(isValidBase64('')).toBe(true);
    });

    it('returns false for invalid base64', () => {
      expect(isValidBase64('not valid!')).toBe(false);
    });

    it('returns true for base64 with padding', () => {
      expect(isValidBase64('YQ==')).toBe(true);
      expect(isValidBase64('YWI=')).toBe(true);
      expect(isValidBase64('YWJj')).toBe(true);
    });

    it('returns false for base64 with invalid characters', () => {
      expect(isValidBase64('SGVsbG8@V29ybGQ=')).toBe(false);
    });
  });

  describe('roundtrip encoding/decoding', () => {
    const testCases = [
      'Hello World',
      '',
      'Special chars: !@#$%^&*()',
      'Numbers: 12345',
      'Mixed: Hello123!@#',
      'Multiline:\nLine1\nLine2',
      'Tab\tcharacter',
    ];

    testCases.forEach((input) => {
      it(`roundtrip for: "${input.substring(0, 20)}..."`, () => {
        const encoded = encodeBase64(input);
        const decoded = decodeBase64(encoded);
        expect(decoded).toBe(input);
      });
    });
  });
});
