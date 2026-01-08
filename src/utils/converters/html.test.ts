import { describe, it, expect } from 'vitest';
import { encodeHtml, decodeHtml } from './html';

describe('html', () => {
  describe('encodeHtml', () => {
    it('encodes ampersand', () => {
      expect(encodeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('encodes less than', () => {
      expect(encodeHtml('a < b')).toBe('a &lt; b');
    });

    it('encodes greater than', () => {
      expect(encodeHtml('a > b')).toBe('a &gt; b');
    });

    it('encodes double quotes', () => {
      expect(encodeHtml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('encodes single quotes', () => {
      expect(encodeHtml("it's")).toBe('it&#39;s');
    });

    it('encodes forward slash', () => {
      expect(encodeHtml('path/to/file')).toBe('path&#x2F;to&#x2F;file');
    });

    it('encodes HTML tags', () => {
      expect(encodeHtml('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('handles empty string', () => {
      expect(encodeHtml('')).toBe('');
    });

    it('does not encode safe characters', () => {
      expect(encodeHtml('Hello World 123')).toBe('Hello World 123');
    });

    it('encodes multiple special characters', () => {
      expect(encodeHtml('1 < 2 & 2 > 1')).toBe('1 &lt; 2 &amp; 2 &gt; 1');
    });
  });

  describe('decodeHtml', () => {
    it('decodes ampersand entity', () => {
      expect(decodeHtml('Tom &amp; Jerry')).toBe('Tom & Jerry');
    });

    it('decodes less than entity', () => {
      expect(decodeHtml('a &lt; b')).toBe('a < b');
    });

    it('decodes greater than entity', () => {
      expect(decodeHtml('a &gt; b')).toBe('a > b');
    });

    it('decodes double quote entity', () => {
      expect(decodeHtml('say &quot;hello&quot;')).toBe('say "hello"');
    });

    it('decodes single quote entity', () => {
      expect(decodeHtml('it&#39;s')).toBe("it's");
    });

    it('decodes forward slash entity', () => {
      expect(decodeHtml('path&#x2F;to&#x2F;file')).toBe('path/to/file');
    });

    it('decodes decimal numeric entities', () => {
      expect(decodeHtml('&#65;&#66;&#67;')).toBe('ABC');
    });

    it('decodes hex numeric entities', () => {
      expect(decodeHtml('&#x41;&#x42;&#x43;')).toBe('ABC');
    });

    it('handles empty string', () => {
      expect(decodeHtml('')).toBe('');
    });

    it('handles unknown entities', () => {
      expect(decodeHtml('&unknown;')).toBe('&unknown;');
    });

    it('decodes HTML tags', () => {
      expect(decodeHtml('&lt;div&gt;content&lt;&#x2F;div&gt;'))
        .toBe('<div>content</div>');
    });
  });

  describe('roundtrip encoding/decoding', () => {
    const testCases = [
      'Hello World',
      '<div>content</div>',
      'Tom & Jerry',
      'a < b > c',
      '"quoted"',
      "it's working",
      'path/to/file',
      '1 < 2 & 2 > 1',
      '',
    ];

    testCases.forEach((input) => {
      it(`roundtrip for: "${input}"`, () => {
        const encoded = encodeHtml(input);
        const decoded = decodeHtml(encoded);
        expect(decoded).toBe(input);
      });
    });
  });
});
