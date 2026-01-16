/**
 * @devtools-hub/core
 * Core utilities package for DevTools Hub extensions
 * Re-exports all utility functions for use in Chrome and VS Code extensions
 */

// Formatters
export {
  formatJson,
  minifyJson,
  validateJson,
} from '../../../src/utils/formatters/json';

export {
  formatJavaScript,
  minifyJavaScript,
  formatCSS,
  minifyCSS,
  formatHTML,
  minifyHTML,
} from '../../../src/utils/formatters/code';

// Converters
export {
  jsonToYaml,
  yamlToJson,
  formatYaml,
} from '../../../src/utils/converters/yaml';

export {
  jsonToXml,
  xmlToJson,
  formatXml,
} from '../../../src/utils/converters/xml';

export {
  jsonToCsv,
  csvToJson,
} from '../../../src/utils/converters/csv';

export {
  jsonToTypeScript,
  defaultOptions as typeScriptDefaultOptions,
} from '../../../src/utils/converters/typescript';

export type { TypeScriptOptions } from '../../../src/utils/converters/typescript';

export {
  markdownToHtml,
  htmlToMarkdown,
  isValidHtml,
  isValidMarkdown,
} from '../../../src/utils/converters/markdown';

export {
  encodeBase64,
  decodeBase64,
  isValidBase64,
} from '../../../src/utils/converters/base64';

export {
  encodeUrl,
  decodeUrl,
  encodeUrlFull,
  decodeUrlFull,
} from '../../../src/utils/converters/url';

// Generators
export {
  generateUuidV4,
  generateMultipleUuids,
  isValidUuid,
} from '../../../src/utils/generators/uuid';

export {
  generateMD5,
  generateSHA1,
  generateSHA256,
  generateSHA512,
  generateAllHashes,
} from '../../../src/utils/generators/hash';

// Text utilities
export {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toLowercase,
  toUppercase,
} from '../../../src/utils/text/case';
