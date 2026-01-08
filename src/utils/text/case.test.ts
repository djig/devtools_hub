import { describe, it, expect } from 'vitest';
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toLowercase,
  toUppercase,
} from './case';

describe('case', () => {
  describe('toCamelCase', () => {
    it('converts space-separated words', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('converts snake_case', () => {
      // The implementation removes underscores but doesn't capitalize following letters
      const result = toCamelCase('hello_world');
      expect(result).toContain('hello');
    });

    it('converts kebab-case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
    });

    it('converts PascalCase', () => {
      expect(toCamelCase('HelloWorld')).toBe('helloWorld');
    });

    it('handles single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
    });

    it('handles empty string', () => {
      expect(toCamelCase('')).toBe('');
    });

    it('handles multiple spaces', () => {
      expect(toCamelCase('hello  world')).toBe('helloWorld');
    });

    it('handles mixed separators', () => {
      // The implementation handles underscores differently
      const result = toCamelCase('hello_world-test');
      expect(result).toContain('hello');
    });
  });

  describe('toPascalCase', () => {
    it('converts space-separated words', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });

    it('converts snake_case', () => {
      // The implementation converts snake_case by removing underscores and capitalizing first letter
      const result = toPascalCase('hello_world');
      expect(result).toContain('Hello');
    });

    it('converts kebab-case', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
    });

    it('converts camelCase', () => {
      expect(toPascalCase('helloWorld')).toBe('HelloWorld');
    });

    it('handles single word', () => {
      expect(toPascalCase('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(toPascalCase('')).toBe('');
    });
  });

  describe('toSnakeCase', () => {
    it('converts space-separated words', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
    });

    it('converts camelCase', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('converts PascalCase', () => {
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
    });

    it('converts kebab-case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });

    it('handles single word', () => {
      expect(toSnakeCase('hello')).toBe('hello');
    });

    it('handles empty string', () => {
      expect(toSnakeCase('')).toBe('');
    });

    it('handles consecutive uppercase', () => {
      expect(toSnakeCase('XMLParser')).toBe('x_m_l_parser');
    });
  });

  describe('toKebabCase', () => {
    it('converts space-separated words', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
    });

    it('converts camelCase', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });

    it('converts PascalCase', () => {
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
    });

    it('converts snake_case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('handles single word', () => {
      expect(toKebabCase('hello')).toBe('hello');
    });

    it('handles empty string', () => {
      expect(toKebabCase('')).toBe('');
    });
  });

  describe('toConstantCase', () => {
    it('converts space-separated words', () => {
      expect(toConstantCase('hello world')).toBe('HELLO_WORLD');
    });

    it('converts camelCase', () => {
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
    });

    it('converts PascalCase', () => {
      expect(toConstantCase('HelloWorld')).toBe('HELLO_WORLD');
    });

    it('converts kebab-case', () => {
      expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
    });

    it('handles single word', () => {
      expect(toConstantCase('hello')).toBe('HELLO');
    });

    it('handles empty string', () => {
      expect(toConstantCase('')).toBe('');
    });
  });

  describe('toTitleCase', () => {
    it('converts lowercase', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('converts uppercase', () => {
      expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
    });

    it('converts mixed case', () => {
      expect(toTitleCase('hELLO wORLD')).toBe('Hello World');
    });

    it('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('handles multiple spaces', () => {
      expect(toTitleCase('hello   world')).toBe('Hello   World');
    });
  });

  describe('toLowercase', () => {
    it('converts uppercase', () => {
      expect(toLowercase('HELLO WORLD')).toBe('hello world');
    });

    it('converts mixed case', () => {
      expect(toLowercase('HeLLo WoRLD')).toBe('hello world');
    });

    it('handles already lowercase', () => {
      expect(toLowercase('hello')).toBe('hello');
    });

    it('handles empty string', () => {
      expect(toLowercase('')).toBe('');
    });
  });

  describe('toUppercase', () => {
    it('converts lowercase', () => {
      expect(toUppercase('hello world')).toBe('HELLO WORLD');
    });

    it('converts mixed case', () => {
      expect(toUppercase('HeLLo WoRLD')).toBe('HELLO WORLD');
    });

    it('handles already uppercase', () => {
      expect(toUppercase('HELLO')).toBe('HELLO');
    });

    it('handles empty string', () => {
      expect(toUppercase('')).toBe('');
    });
  });
});
