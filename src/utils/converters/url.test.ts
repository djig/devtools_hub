import { describe, it, expect } from 'vitest';
import { encodeUrl, decodeUrl, encodeUrlFull, decodeUrlFull } from './url';

describe('url', () => {
  describe('encodeUrl', () => {
    it('encodes spaces', () => {
      expect(encodeUrl('hello world')).toBe('hello%20world');
    });

    it('encodes special characters', () => {
      expect(encodeUrl('name=value&other=test')).toBe('name%3Dvalue%26other%3Dtest');
    });

    it('does not encode unreserved characters', () => {
      expect(encodeUrl('ABCabc123-_.~')).toBe('ABCabc123-_.~');
    });

    it('encodes unicode characters', () => {
      expect(encodeUrl('hello世界')).toBe('hello%E4%B8%96%E7%95%8C');
    });

    it('encodes empty string', () => {
      expect(encodeUrl('')).toBe('');
    });

    it('encodes forward slash', () => {
      expect(encodeUrl('path/to/file')).toBe('path%2Fto%2Ffile');
    });

    it('encodes query string characters', () => {
      expect(encodeUrl('?key=value')).toBe('%3Fkey%3Dvalue');
    });
  });

  describe('decodeUrl', () => {
    it('decodes spaces', () => {
      expect(decodeUrl('hello%20world')).toBe('hello world');
    });

    it('decodes special characters', () => {
      expect(decodeUrl('name%3Dvalue%26other%3Dtest')).toBe('name=value&other=test');
    });

    it('decodes unicode characters', () => {
      expect(decodeUrl('hello%E4%B8%96%E7%95%8C')).toBe('hello世界');
    });

    it('decodes empty string', () => {
      expect(decodeUrl('')).toBe('');
    });

    it('throws error for invalid encoding', () => {
      expect(() => decodeUrl('%')).toThrow('Invalid URL encoding');
      expect(() => decodeUrl('%GG')).toThrow('Invalid URL encoding');
    });

    it('handles plus as plus (not space)', () => {
      expect(decodeUrl('hello+world')).toBe('hello+world');
    });
  });

  describe('encodeUrlFull', () => {
    it('encodes full URL preserving structure', () => {
      expect(encodeUrlFull('https://example.com/path?query=hello world'))
        .toBe('https://example.com/path?query=hello%20world');
    });

    it('preserves URL reserved characters', () => {
      expect(encodeUrlFull('https://example.com:8080/path'))
        .toBe('https://example.com:8080/path');
    });

    it('encodes unicode in URL', () => {
      expect(encodeUrlFull('https://example.com/世界'))
        .toBe('https://example.com/%E4%B8%96%E7%95%8C');
    });
  });

  describe('decodeUrlFull', () => {
    it('decodes full URL', () => {
      expect(decodeUrlFull('https://example.com/path?query=hello%20world'))
        .toBe('https://example.com/path?query=hello world');
    });

    it('decodes unicode in URL', () => {
      expect(decodeUrlFull('https://example.com/%E4%B8%96%E7%95%8C'))
        .toBe('https://example.com/世界');
    });

    it('throws error for invalid URL', () => {
      expect(() => decodeUrlFull('%')).toThrow('Invalid URL');
    });
  });

  describe('roundtrip encoding/decoding', () => {
    const testCases = [
      'simple text',
      'with spaces here',
      'special=chars&more',
      'unicode世界',
      '',
    ];

    testCases.forEach((input) => {
      it(`roundtrip encodeUrl/decodeUrl for: "${input}"`, () => {
        const encoded = encodeUrl(input);
        const decoded = decodeUrl(encoded);
        expect(decoded).toBe(input);
      });
    });
  });
});
