import { describe, it, expect } from 'vitest';
import { jsonToXml, xmlToJson, formatXml } from './xml';

describe('xml', () => {
  describe('jsonToXml', () => {
    it('converts simple object', () => {
      const json = JSON.stringify({ root: { name: 'test' } });
      const xml = jsonToXml(json);
      expect(xml).toContain('<root>');
      expect(xml).toContain('<name>test</name>');
      expect(xml).toContain('</root>');
    });

    it('converts nested objects', () => {
      const json = JSON.stringify({
        root: {
          person: {
            name: 'John',
            age: 30,
          },
        },
      });
      const xml = jsonToXml(json);
      expect(xml).toContain('<person>');
      expect(xml).toContain('<name>John</name>');
      expect(xml).toContain('<age>30</age>');
    });

    it('converts arrays', () => {
      const json = JSON.stringify({
        root: {
          items: ['a', 'b', 'c'],
        },
      });
      const xml = jsonToXml(json);
      expect(xml).toContain('<items>');
    });

    it('throws error for invalid JSON', () => {
      expect(() => jsonToXml('not json')).toThrow('Invalid JSON');
    });

    it('handles empty object', () => {
      const json = JSON.stringify({});
      const xml = jsonToXml(json);
      expect(xml).toBeDefined();
    });

    it('handles boolean values', () => {
      const json = JSON.stringify({ root: { active: true } });
      const xml = jsonToXml(json);
      expect(xml).toContain('<active>true</active>');
    });

    it('handles numeric values', () => {
      const json = JSON.stringify({ root: { count: 42 } });
      const xml = jsonToXml(json);
      expect(xml).toContain('<count>42</count>');
    });
  });

  describe('xmlToJson', () => {
    it('converts simple XML', () => {
      const xml = '<root><name>test</name></root>';
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root.name).toBe('test');
    });

    it('converts nested XML', () => {
      const xml = '<root><person><name>John</name><age>30</age></person></root>';
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root.person.name).toBe('John');
      expect(parsed.root.person.age).toBe(30);
    });

    it('handles XML with attributes', () => {
      const xml = '<root id="1"><name>test</name></root>';
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root['@_id']).toBe('1');
    });

    it('respects spaces parameter', () => {
      const xml = '<root><name>test</name></root>';
      const result4 = xmlToJson(xml, 4);
      expect(result4).toContain('    ');
    });

    it('throws error for invalid XML', () => {
      expect(() => xmlToJson('<<<invalid')).toThrow('Invalid XML');
    });

    it('handles empty root element', () => {
      const xml = '<root></root>';
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root).toBeDefined();
    });

    it('handles self-closing tags', () => {
      const xml = '<root><empty/></root>';
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root).toBeDefined();
    });
  });

  describe('formatXml', () => {
    it('formats unformatted XML', () => {
      const xml = '<root><name>test</name><age>30</age></root>';
      const formatted = formatXml(xml);
      expect(formatted).toContain('\n');
    });

    it('preserves content', () => {
      const xml = '<root><name>test</name></root>';
      const formatted = formatXml(xml);
      expect(formatted).toContain('test');
    });

    it('handles nested elements', () => {
      const xml = '<root><a><b><c>deep</c></b></a></root>';
      const formatted = formatXml(xml);
      expect(formatted).toContain('deep');
    });

    it('throws error for invalid XML', () => {
      expect(() => formatXml('<<<invalid')).toThrow('Invalid XML');
    });
  });

  describe('roundtrip conversions', () => {
    it('preserves simple data', () => {
      const original = { root: { name: 'test', value: 42 } };
      const xml = jsonToXml(JSON.stringify(original));
      const result = xmlToJson(xml);
      const parsed = JSON.parse(result);
      expect(parsed.root.name).toBe('test');
      expect(parsed.root.value).toBe(42);
    });
  });
});
