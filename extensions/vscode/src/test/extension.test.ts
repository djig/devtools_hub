import { describe, it, expect } from 'vitest';

// Note: VS Code extension tests typically run in a VS Code instance
// These are basic unit tests for the utility functions

describe('DevTools Hub VS Code Extension', () => {
  describe('Case Converters', () => {
    const toCamelCase = (str: string): string => {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+|_|-/g, '');
    };

    const toSnakeCase = (str: string): string => {
      return str
        .replace(/([A-Z])/g, '_$1')
        .replace(/\s+|-/g, '_')
        .toLowerCase()
        .replace(/^_/, '');
    };

    it('should convert to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
    });

    it('should convert to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
    });
  });

  describe('Base64 Encoding', () => {
    const encodeBase64 = (input: string): string => {
      return Buffer.from(input, 'utf-8').toString('base64');
    };

    const decodeBase64 = (input: string): string => {
      return Buffer.from(input, 'base64').toString('utf-8');
    };

    it('should encode to Base64', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should decode from Base64', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    });
  });

  describe('URL Encoding', () => {
    it('should URL encode', () => {
      expect(encodeURIComponent('hello world')).toBe('hello%20world');
      expect(encodeURIComponent('a=1&b=2')).toBe('a%3D1%26b%3D2');
    });

    it('should URL decode', () => {
      expect(decodeURIComponent('hello%20world')).toBe('hello world');
    });
  });

  describe('JSON Operations', () => {
    it('should format JSON', () => {
      const input = '{"name":"test","value":123}';
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      expect(formatted).toContain('"name": "test"');
      expect(formatted).toContain('"value": 123');
    });

    it('should minify JSON', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      expect(minified).toBe('{"name":"test","value":123}');
    });
  });
});
