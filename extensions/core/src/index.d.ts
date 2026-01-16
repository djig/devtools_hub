/**
 * @devtools-hub/core
 * Type definitions for DevTools Hub core utilities
 */

// Formatters - JSON
export declare function formatJson(input: string, spaces?: number): string;
export declare function minifyJson(input: string): string;
export declare function validateJson(input: string): { valid: boolean; error?: string };

// Formatters - Code
export declare function formatJavaScript(code: string): string;
export declare function minifyJavaScript(code: string): string;
export declare function formatCSS(code: string): string;
export declare function minifyCSS(code: string): string;
export declare function formatHTML(code: string): string;
export declare function minifyHTML(code: string): string;

// Converters - YAML
export declare function jsonToYaml(jsonString: string): string;
export declare function yamlToJson(yamlString: string, spaces?: number): string;
export declare function formatYaml(yamlString: string): string;

// Converters - XML
export declare function jsonToXml(jsonString: string): string;
export declare function xmlToJson(xmlString: string, spaces?: number): string;
export declare function formatXml(xmlString: string): string;

// Converters - CSV
export declare function jsonToCsv(jsonString: string): string;
export declare function csvToJson(csvString: string, spaces?: number): string;

// Converters - TypeScript
export interface TypeScriptOptions {
  useInterface: boolean;
  exportTypes: boolean;
  optionalProperties: boolean;
  readonlyProperties: boolean;
  addComments: boolean;
  rootName: string;
}
export declare const typeScriptDefaultOptions: TypeScriptOptions;
export declare function jsonToTypeScript(jsonString: string, options?: Partial<TypeScriptOptions>): string;

// Converters - Markdown
export declare function markdownToHtml(markdown: string): string;
export declare function htmlToMarkdown(html: string): string;
export declare function isValidHtml(html: string): boolean;
export declare function isValidMarkdown(markdown: string): boolean;

// Converters - Base64
export declare function encodeBase64(input: string): string;
export declare function decodeBase64(input: string): string;
export declare function isValidBase64(str: string): boolean;

// Converters - URL
export declare function encodeUrl(text: string): string;
export declare function decodeUrl(text: string): string;
export declare function encodeUrlFull(url: string): string;
export declare function decodeUrlFull(url: string): string;

// Generators - UUID
export declare function generateUuidV4(): string;
export declare function generateMultipleUuids(count: number): string[];
export declare function isValidUuid(uuid: string): boolean;

// Generators - Hash
export declare function generateMD5(text: string): string;
export declare function generateSHA1(text: string): string;
export declare function generateSHA256(text: string): string;
export declare function generateSHA512(text: string): string;
export declare function generateAllHashes(text: string): {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
};

// Text - Case Converters
export declare function toCamelCase(str: string): string;
export declare function toPascalCase(str: string): string;
export declare function toSnakeCase(str: string): string;
export declare function toKebabCase(str: string): string;
export declare function toConstantCase(str: string): string;
export declare function toTitleCase(str: string): string;
export declare function toLowercase(str: string): string;
export declare function toUppercase(str: string): string;
