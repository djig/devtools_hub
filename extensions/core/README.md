# @devtools-hub/core

Core utilities package for DevTools Hub extensions. Re-exports all utility functions for use in Chrome and VS Code extensions.

## Installation

```bash
npm install @devtools-hub/core
```

## Usage

```typescript
import {
  formatJson,
  minifyJson,
  jsonToYaml,
  encodeBase64,
  generateUuidV4,
  toCamelCase,
} from '@devtools-hub/core';

// Format JSON
const formatted = formatJson('{"name":"test"}');

// Convert JSON to YAML
const yaml = jsonToYaml('{"name": "test"}');

// Generate UUID
const uuid = generateUuidV4();

// Case conversion
const camelCase = toCamelCase('hello world'); // helloWorld
```

## Available Functions

### Formatters

- `formatJson(input, spaces?)` - Format JSON with indentation
- `minifyJson(input)` - Minify JSON
- `validateJson(input)` - Validate JSON syntax
- `formatJavaScript(code)` - Format JavaScript code
- `formatCSS(code)` - Format CSS
- `formatHTML(code)` - Format HTML
- `minifyJavaScript(code)` - Minify JavaScript
- `minifyCSS(code)` - Minify CSS
- `minifyHTML(code)` - Minify HTML

### Converters

- `jsonToYaml(json)` / `yamlToJson(yaml)` - JSON ↔ YAML
- `jsonToXml(json)` / `xmlToJson(xml)` - JSON ↔ XML
- `jsonToCsv(json)` / `csvToJson(csv)` - JSON ↔ CSV
- `jsonToTypeScript(json, options?)` - Generate TypeScript types from JSON
- `markdownToHtml(md)` / `htmlToMarkdown(html)` - Markdown ↔ HTML
- `formatYaml(yaml)` - Format YAML
- `formatXml(xml)` - Format XML

### Encoders

- `encodeBase64(input)` / `decodeBase64(input)` - Base64 encoding/decoding
- `encodeUrl(text)` / `decodeUrl(text)` - URL encoding/decoding
- `isValidBase64(str)` - Check if string is valid Base64

### Generators

- `generateUuidV4()` - Generate UUID v4
- `generateMultipleUuids(count)` - Generate multiple UUIDs
- `isValidUuid(uuid)` - Validate UUID format
- `generateMD5(text)` - Generate MD5 hash
- `generateSHA1(text)` - Generate SHA1 hash
- `generateSHA256(text)` - Generate SHA256 hash
- `generateSHA512(text)` - Generate SHA512 hash
- `generateAllHashes(text)` - Generate all hash types

### Text Utilities

- `toCamelCase(str)` - Convert to camelCase
- `toPascalCase(str)` - Convert to PascalCase
- `toSnakeCase(str)` - Convert to snake_case
- `toKebabCase(str)` - Convert to kebab-case
- `toConstantCase(str)` - Convert to CONSTANT_CASE
- `toTitleCase(str)` - Convert to Title Case
- `toUppercase(str)` - Convert to UPPERCASE
- `toLowercase(str)` - Convert to lowercase

## Building

```bash
npm run build
```

## Testing

```bash
npm test
```

## License

MIT
