import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson } from './json';

describe('json', () => {
  describe('formatJson', () => {
    it('formats simple object', () => {
      const input = '{"name":"test"}';
      const formatted = formatJson(input);
      expect(formatted).toContain('\n');
      expect(formatted).toContain('  ');
    });

    it('formats nested object', () => {
      const input = '{"person":{"name":"John","age":30}}';
      const formatted = formatJson(input);
      expect(formatted).toContain('"person"');
      expect(formatted).toContain('"name"');
    });

    it('formats array', () => {
      const input = '[1,2,3]';
      const formatted = formatJson(input);
      expect(formatted).toContain('\n');
    });

    it('respects spaces parameter', () => {
      const input = '{"a":1}';
      const formatted4 = formatJson(input, 4);
      expect(formatted4).toContain('    ');
    });

    it('handles empty object', () => {
      const input = '{}';
      const formatted = formatJson(input);
      expect(formatted).toBe('{}');
    });

    it('handles empty array', () => {
      const input = '[]';
      const formatted = formatJson(input);
      expect(formatted).toBe('[]');
    });

    it('throws error for invalid JSON', () => {
      expect(() => formatJson('not json')).toThrow('Invalid JSON');
    });

    it('throws error for incomplete JSON', () => {
      expect(() => formatJson('{"name":')).toThrow('Invalid JSON');
    });

    it('handles null', () => {
      const input = 'null';
      const formatted = formatJson(input);
      expect(formatted).toBe('null');
    });

    it('handles boolean', () => {
      expect(formatJson('true')).toBe('true');
      expect(formatJson('false')).toBe('false');
    });

    it('handles number', () => {
      expect(formatJson('123')).toBe('123');
      expect(formatJson('45.67')).toBe('45.67');
    });

    it('handles string', () => {
      expect(formatJson('"hello"')).toBe('"hello"');
    });
  });

  describe('minifyJson', () => {
    it('minifies formatted object', () => {
      const input = '{\n  "name": "test"\n}';
      const minified = minifyJson(input);
      expect(minified).toBe('{"name":"test"}');
    });

    it('minifies nested object', () => {
      const input = '{\n  "person": {\n    "name": "John"\n  }\n}';
      const minified = minifyJson(input);
      expect(minified).toBe('{"person":{"name":"John"}}');
    });

    it('minifies array', () => {
      const input = '[\n  1,\n  2,\n  3\n]';
      const minified = minifyJson(input);
      expect(minified).toBe('[1,2,3]');
    });

    it('handles already minified JSON', () => {
      const input = '{"a":1}';
      const minified = minifyJson(input);
      expect(minified).toBe('{"a":1}');
    });

    it('throws error for invalid JSON', () => {
      expect(() => minifyJson('not json')).toThrow('Invalid JSON');
    });
  });

  describe('validateJson', () => {
    it('returns valid for valid object', () => {
      const result = validateJson('{"name":"test"}');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid for valid array', () => {
      const result = validateJson('[1,2,3]');
      expect(result.valid).toBe(true);
    });

    it('returns valid for null', () => {
      const result = validateJson('null');
      expect(result.valid).toBe(true);
    });

    it('returns valid for boolean', () => {
      expect(validateJson('true').valid).toBe(true);
      expect(validateJson('false').valid).toBe(true);
    });

    it('returns valid for number', () => {
      expect(validateJson('123').valid).toBe(true);
      expect(validateJson('45.67').valid).toBe(true);
    });

    it('returns valid for string', () => {
      expect(validateJson('"hello"').valid).toBe(true);
    });

    it('returns invalid for invalid JSON', () => {
      const result = validateJson('not json');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns invalid for incomplete JSON', () => {
      const result = validateJson('{"name":');
      expect(result.valid).toBe(false);
    });

    it('returns invalid for trailing comma', () => {
      const result = validateJson('{"name":"test",}');
      expect(result.valid).toBe(false);
    });
  });

  describe('roundtrip', () => {
    const testCases = [
      { name: 'test', value: 42 },
      [1, 2, 3],
      { nested: { deep: { value: true } } },
      null,
      'hello',
      123,
    ];

    testCases.forEach((original, index) => {
      it(`roundtrip ${index + 1}: format then minify`, () => {
        const json = JSON.stringify(original);
        const formatted = formatJson(json);
        const minified = minifyJson(formatted);
        expect(JSON.parse(minified)).toEqual(original);
      });
    });
  });
});
