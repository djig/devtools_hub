import { describe, it, expect } from 'vitest';
import { jsonToCsv, csvToJson } from './csv';

describe('csv', () => {
  describe('jsonToCsv', () => {
    it('converts simple array of objects', () => {
      const json = JSON.stringify([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ]);
      const csv = jsonToCsv(json);
      expect(csv).toContain('name');
      expect(csv).toContain('age');
      expect(csv).toContain('John');
      expect(csv).toContain('Jane');
    });

    it('converts single object to array', () => {
      const json = JSON.stringify({ name: 'John', age: 30 });
      const csv = jsonToCsv(json);
      expect(csv).toContain('name');
      expect(csv).toContain('John');
    });

    it('handles empty array', () => {
      const json = JSON.stringify([]);
      const csv = jsonToCsv(json);
      expect(csv).toBe('');
    });

    it('handles values with commas', () => {
      const json = JSON.stringify([{ text: 'Hello, World' }]);
      const csv = jsonToCsv(json);
      expect(csv).toContain('"Hello, World"');
    });

    it('handles values with quotes', () => {
      const json = JSON.stringify([{ text: 'Say "Hello"' }]);
      const csv = jsonToCsv(json);
      expect(csv).toContain('""');
    });

    it('throws error for invalid JSON', () => {
      expect(() => jsonToCsv('not json')).toThrow('Invalid JSON');
    });

    it('handles numeric values', () => {
      const json = JSON.stringify([{ value: 123, price: 45.67 }]);
      const csv = jsonToCsv(json);
      expect(csv).toContain('123');
      expect(csv).toContain('45.67');
    });

    it('handles boolean values', () => {
      const json = JSON.stringify([{ active: true, disabled: false }]);
      const csv = jsonToCsv(json);
      expect(csv).toContain('true');
      expect(csv).toContain('false');
    });

    it('handles null values', () => {
      const json = JSON.stringify([{ name: null }]);
      const csv = jsonToCsv(json);
      expect(csv).toBeDefined();
    });
  });

  describe('csvToJson', () => {
    it('converts simple CSV to JSON', () => {
      const csv = 'name,age\nJohn,30\nJane,25';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toEqual({ name: 'John', age: '30' });
      expect(parsed[1]).toEqual({ name: 'Jane', age: '25' });
    });

    it('handles CSV with only headers', () => {
      const csv = 'name,age';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual([]);
    });

    it('respects spaces parameter', () => {
      const csv = 'name,age\nJohn,30';
      const result4 = csvToJson(csv, 4);
      expect(result4).toContain('    ');
    });

    it('handles quoted values with commas', () => {
      const csv = 'name,text\nJohn,"Hello, World"';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed[0].text).toBe('Hello, World');
    });

    it('handles quoted values with special characters', () => {
      const csv = 'name,text\nJohn,"Hello, World"';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed[0].text).toBe('Hello, World');
    });

    it('handles quoted values with escaped quotes', () => {
      const csv = 'name,text\nJohn,"Say ""Hello"""';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed[0].text).toBe('Say "Hello"');
    });

    it('handles multiple rows', () => {
      const csv = 'name,age\nJohn,30\nJane,25\nBob,35';
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed).toHaveLength(3);
    });
  });

  describe('roundtrip conversions', () => {
    it('preserves data through conversion', () => {
      const original = [
        { name: 'John', age: '30', city: 'New York' },
        { name: 'Jane', age: '25', city: 'Boston' },
      ];
      const csv = jsonToCsv(JSON.stringify(original));
      const result = csvToJson(csv);
      const parsed = JSON.parse(result);
      expect(parsed).toEqual(original);
    });
  });
});
