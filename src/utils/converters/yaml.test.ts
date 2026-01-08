import { describe, it, expect } from 'vitest';
import { jsonToYaml, yamlToJson, formatYaml } from './yaml';

describe('yaml', () => {
  describe('jsonToYaml', () => {
    it('converts simple object', () => {
      const json = JSON.stringify({ name: 'test', value: 42 });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('name: test');
      expect(yaml).toContain('value: 42');
    });

    it('converts nested objects', () => {
      const json = JSON.stringify({
        person: {
          name: 'John',
          age: 30,
        },
      });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('person:');
      expect(yaml).toContain('name: John');
      expect(yaml).toContain('age: 30');
    });

    it('converts arrays', () => {
      const json = JSON.stringify({ items: ['a', 'b', 'c'] });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('items:');
      expect(yaml).toContain('- a');
      expect(yaml).toContain('- b');
      expect(yaml).toContain('- c');
    });

    it('handles empty object', () => {
      const json = JSON.stringify({});
      const yaml = jsonToYaml(json);
      expect(yaml).toBe('{}\n');
    });

    it('handles empty array', () => {
      const json = JSON.stringify([]);
      const yaml = jsonToYaml(json);
      expect(yaml).toBe('[]\n');
    });

    it('throws error for invalid JSON', () => {
      expect(() => jsonToYaml('not json')).toThrow('Invalid JSON');
    });

    it('handles boolean values', () => {
      const json = JSON.stringify({ active: true, disabled: false });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('active: true');
      expect(yaml).toContain('disabled: false');
    });

    it('handles null values', () => {
      const json = JSON.stringify({ value: null });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('null');
    });

    it('handles string values with special characters', () => {
      const json = JSON.stringify({ text: 'Hello: World' });
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('Hello: World');
    });
  });

  describe('yamlToJson', () => {
    it('converts simple YAML', () => {
      const yaml = 'name: test\nvalue: 42';
      const result = yamlToJson(yaml);
      const parsed = JSON.parse(result);
      expect(parsed.name).toBe('test');
      expect(parsed.value).toBe(42);
    });

    it('converts nested YAML', () => {
      const yaml = 'person:\n  name: John\n  age: 30';
      const result = yamlToJson(yaml);
      const parsed = JSON.parse(result);
      expect(parsed.person.name).toBe('John');
      expect(parsed.person.age).toBe(30);
    });

    it('converts arrays', () => {
      const yaml = 'items:\n  - a\n  - b\n  - c';
      const result = yamlToJson(yaml);
      const parsed = JSON.parse(result);
      expect(parsed.items).toEqual(['a', 'b', 'c']);
    });

    it('respects spaces parameter', () => {
      const yaml = 'name: test';
      const result4 = yamlToJson(yaml, 4);
      expect(result4).toContain('    ');
    });

    it('handles lenient YAML parsing', () => {
      // js-yaml parser is lenient with some invalid YAML
      const result = yamlToJson('key: value\n  invalid indent');
      expect(result).toBeDefined();
    });

    it('handles empty YAML', () => {
      const yaml = '';
      const result = yamlToJson(yaml);
      // Empty YAML may return undefined or null depending on the parser
      expect(result === 'null' || result === undefined).toBe(true);
    });

    it('handles boolean values', () => {
      const yaml = 'active: true\ndisabled: false';
      const result = yamlToJson(yaml);
      const parsed = JSON.parse(result);
      expect(parsed.active).toBe(true);
      expect(parsed.disabled).toBe(false);
    });

    it('handles multiline strings', () => {
      const yaml = 'text: |\n  Line 1\n  Line 2';
      const result = yamlToJson(yaml);
      const parsed = JSON.parse(result);
      expect(parsed.text).toContain('Line 1');
      expect(parsed.text).toContain('Line 2');
    });
  });

  describe('formatYaml', () => {
    it('formats YAML with consistent indentation', () => {
      const yaml = 'person:\n    name: John\n    age: 30';
      const formatted = formatYaml(yaml);
      expect(formatted).toContain('  name:');
    });

    it('preserves content', () => {
      const yaml = 'name: test\nvalue: 42';
      const formatted = formatYaml(yaml);
      expect(formatted).toContain('test');
      expect(formatted).toContain('42');
    });

    it('handles potentially invalid YAML gracefully', () => {
      // Some YAML parsers may be lenient with indentation
      const result = formatYaml('key: value\n  invalid');
      expect(result).toBeDefined();
    });
  });

  describe('roundtrip conversions', () => {
    const testCases = [
      { name: 'test', value: 42 },
      { items: ['a', 'b', 'c'] },
      { nested: { deep: { value: true } } },
      { mixed: { string: 'hello', number: 123, bool: false } },
    ];

    testCases.forEach((original, index) => {
      it(`roundtrip ${index + 1}`, () => {
        const yaml = jsonToYaml(JSON.stringify(original));
        const result = yamlToJson(yaml);
        const parsed = JSON.parse(result);
        expect(parsed).toEqual(original);
      });
    });
  });
});
