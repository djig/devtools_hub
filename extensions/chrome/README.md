# DevTools Hub - Chrome Extension

A Chrome extension providing instant access to developer utilities: format, convert, encode/decode data right from your browser.

## Features

- **Popup UI** - Access all tools from the extension popup with categorized tabs
- **Context Menu** - Right-click selected text to process it with any tool
- **Keyboard Shortcuts** - Quick access to common tools
- **Toast Notifications** - See results copied to clipboard

## Tools Included

### Formatters
- Format/Minify JSON
- Format YAML, XML
- Format JavaScript, CSS, HTML

### Converters
- JSON ↔ YAML
- JSON ↔ XML
- JSON ↔ CSV
- JSON → TypeScript
- Markdown ↔ HTML

### Encoders
- Base64 Encode/Decode
- URL Encode/Decode

### Generators
- UUID v4
- MD5, SHA-256, SHA-512 Hashes

### Text Utilities
- camelCase, PascalCase, snake_case, kebab-case
- UPPERCASE, lowercase, Title Case

## Keyboard Shortcuts

- `Ctrl+Shift+J` / `Cmd+Shift+J` - Format JSON
- `Ctrl+Shift+B` / `Cmd+Shift+B` - Toggle Base64
- `Ctrl+Shift+U` / `Cmd+Shift+U` - Generate UUID

## Installation

### From Source

1. Clone the repository
2. Navigate to `extensions/chrome`
3. Run `npm install && npm run build`
4. Open Chrome and go to `chrome://extensions`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` folder

### Building

```bash
cd extensions/chrome
npm install
npm run build
```

The built extension will be in the `dist/` directory.

## Usage

### Popup
1. Click the DevTools Hub icon in your toolbar
2. Select a category (Formatters, Converters, etc.)
3. Choose a tool
4. Enter your input and click Execute
5. Copy the result

### Context Menu
1. Select text on any webpage
2. Right-click and choose "DevTools Hub"
3. Select the desired operation
4. Result is copied to clipboard

## Development

```bash
npm run dev  # Watch mode
npm run build  # Production build
npm run test:e2e  # Run E2E tests
```

## License

MIT
