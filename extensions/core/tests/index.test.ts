import { describe, it, expect } from 'vitest';
import {
  // Formatters
  formatJson,
  minifyJson,
  validateJson,
  formatJavaScript,
  formatCSS,
  formatHTML,
  // Converters
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  jsonToTypeScript,
  markdownToHtml,
  htmlToMarkdown,
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  // Generators
  generateUuidV4,
  generateMD5,
  generateSHA256,
  // Text
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
} from '../src/index';

describe('@devtools-hub/core', () => {
  describe('JSON Formatters', () => {
    it('should format JSON', () => {
      const input = '{"name":"test","value":123}';
      const result = formatJson(input);
      expect(result).toContain('"name": "test"');
      expect(result).toContain('"value": 123');
    });

    it('should minify JSON', () => {
      const input = '{\n  "name": "test",\n  "value": 123\n}';
      const result = minifyJson(input);
      expect(result).toBe('{"name":"test","value":123}');
    });

    it('should validate JSON', () => {
      expect(validateJson('{"valid": true}')).toEqual({ valid: true });
      expect(validateJson('invalid')).toMatchObject({ valid: false });
    });
  });

  describe('Code Formatters', () => {
    it('should format JavaScript', () => {
      const result = formatJavaScript('function test(){return 1}');
      expect(result).toContain('function test()');
    });

    it('should format CSS', () => {
      const result = formatCSS('body{margin:0}');
      expect(result).toContain('body');
      expect(result).toContain('margin');
    });

    it('should format HTML', () => {
      const result = formatHTML('<div><span>test</span></div>');
      expect(result).toContain('<div>');
      expect(result).toContain('<span>');
    });
  });

  describe('YAML Converter', () => {
    it('should convert JSON to YAML', () => {
      const json = '{"name": "test", "value": 123}';
      const yaml = jsonToYaml(json);
      expect(yaml).toContain('name: test');
      expect(yaml).toContain('value: 123');
    });

    it('should convert YAML to JSON', () => {
      const yaml = 'name: test\nvalue: 123';
      const json = yamlToJson(yaml);
      expect(JSON.parse(json)).toEqual({ name: 'test', value: 123 });
    });
  });

  describe('XML Converter', () => {
    it('should convert JSON to XML', () => {
      const json = '{"root": {"name": "test"}}';
      const xml = jsonToXml(json);
      expect(xml).toContain('<name>test</name>');
    });

    it('should convert XML to JSON', () => {
      const xml = '<root><name>test</name></root>';
      const json = xmlToJson(xml);
      expect(JSON.parse(json)).toHaveProperty('root');
    });
  });

  describe('CSV Converter', () => {
    it('should convert JSON to CSV', () => {
      const json = '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]';
      const csv = jsonToCsv(json);
      expect(csv).toContain('name');
      expect(csv).toContain('Alice');
      expect(csv).toContain('Bob');
    });

    it('should convert CSV to JSON', () => {
      const csv = 'name,age\nAlice,30\nBob,25';
      const json = csvToJson(csv);
      const parsed = JSON.parse(json);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].name).toBe('Alice');
    });
  });

  describe('TypeScript Converter', () => {
    it('should convert JSON to TypeScript', () => {
      const json = '{"name": "test", "value": 123}';
      const ts = jsonToTypeScript(json);
      expect(ts).toContain('interface');
      expect(ts).toContain('name: string');
      expect(ts).toContain('value: number');
    });
  });

  describe('Markdown Converter', () => {
    it('should convert Markdown to HTML', () => {
      const md = '# Hello\n\nThis is **bold** text.';
      const html = markdownToHtml(md);
      expect(html).toContain('<h1>');
      expect(html).toContain('<strong>');
    });

    it('should convert HTML to Markdown', () => {
      const html = '<h1>Hello</h1><p>This is <strong>bold</strong> text.</p>';
      const md = htmlToMarkdown(html);
      expect(md).toContain('# Hello');
      expect(md).toContain('**bold**');
    });
  });

  describe('Base64 Encoder', () => {
    it('should encode to Base64', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
    });

    it('should decode from Base64', () => {
      expect(decodeBase64('SGVsbG8gV29ybGQ=')).toBe('Hello World');
    });
  });

  describe('URL Encoder', () => {
    it('should encode URL', () => {
      expect(encodeUrl('hello world')).toBe('hello%20world');
    });

    it('should decode URL', () => {
      expect(decodeUrl('hello%20world')).toBe('hello world');
    });
  });

  describe('UUID Generator', () => {
    it('should generate valid UUID v4', () => {
      const uuid = generateUuidV4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('Hash Generator', () => {
    it('should generate MD5 hash', () => {
      const hash = generateMD5('test');
      expect(hash).toBe('098f6bcd4621d373cade4e832627b4f6');
    });

    it('should generate SHA256 hash', () => {
      const hash = generateSHA256('test');
      expect(hash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
    });
  });

  describe('Case Converters', () => {
    it('should convert to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
    });

    it('should convert to PascalCase', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });

    it('should convert to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should convert to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
    });
  });
});
