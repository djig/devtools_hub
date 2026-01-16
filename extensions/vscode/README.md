# DevTools Hub - VS Code Extension

A VS Code extension providing instant access to developer utilities: format, convert, encode/decode data right in your editor.

## Features

- **30+ Commands** - Access all tools from the Command Palette
- **Context Menu** - Right-click to access common tools
- **Keyboard Shortcuts** - Quick access to frequently used tools
- **Status Bar** - One-click access to the full tool menu
- **Selection Support** - Works with selected text or entire document

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
- MD5, SHA-256 Hashes

### Text Utilities
- camelCase, PascalCase, snake_case, kebab-case
- UPPERCASE, lowercase

## Keyboard Shortcuts

- `Ctrl+Shift+J` / `Cmd+Shift+J` - Format JSON
- `Ctrl+Shift+U` / `Cmd+Shift+U` - Generate UUID
- `Ctrl+Shift+D` / `Cmd+Shift+D` - Show All Tools (Quick Pick)

## Commands

All commands are prefixed with `DevTools Hub:` in the Command Palette.

| Command | Description |
|---------|-------------|
| Format JSON | Format JSON with indentation |
| Minify JSON | Remove whitespace from JSON |
| Format YAML | Format YAML |
| Format XML | Format XML |
| JSON → YAML | Convert JSON to YAML |
| YAML → JSON | Convert YAML to JSON |
| Encode Base64 | Encode text to Base64 |
| Decode Base64 | Decode Base64 to text |
| Generate UUID | Insert a new UUID v4 |
| To camelCase | Convert text to camelCase |
| Show All Tools | Open quick pick with all tools |

## Installation

### From Source

1. Clone the repository
2. Navigate to `extensions/vscode`
3. Run `npm install && npm run build`
4. Press F5 to launch Extension Development Host

### Building

```bash
cd extensions/vscode
npm install
npm run build
```

### Packaging

```bash
npm run package  # Creates .vsix file
```

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `devtools-hub.showStatusBarItem` | `true` | Show DevTools Hub in status bar |
| `devtools-hub.jsonIndent` | `2` | Number of spaces for JSON indentation |

## Usage

### Command Palette
1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "DevTools Hub"
3. Select the desired command

### Context Menu
1. Select text in your editor
2. Right-click and choose from the DevTools Hub submenu

### Status Bar
1. Click the "DevTools" item in the status bar
2. Select a tool from the quick pick menu

## Development

```bash
npm run watch  # Watch mode
npm run build  # Production build
npm run test   # Run tests
```

## License

MIT
