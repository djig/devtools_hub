# Chrome & VS Code Extensions for DevTools Hub

## Overview

Create Chrome and VS Code extensions that expose the formatters and converters from DevTools Hub (https://engtoolshub.com) as native browser/editor tools.

## User Decisions
- **Location**: Inside the existing `devtools_hub` project
- **Development**: Both extensions simultaneously
- **Scope**: All formatters & converters (13 tools)

## Architecture Decision

**Monorepo with shared core package** - Extract all utility functions into a shared `@devtools-hub/core` package that both extensions consume.

### Why This Works
- All utilities in `src/utils/` are **pure functions** with no React dependencies
- Consistent string-based input/output patterns
- Well-tested with existing Vitest tests
- Minimal external dependencies (js-yaml, fast-xml-parser, papaparse, markdown-it, etc.)

---

## Tools to Include

### Formatters
| Tool | Functions | Source |
|------|-----------|--------|
| JSON | `formatJson`, `minifyJson`, `validateJson` | `src/utils/formatters/json.ts` |
| XML | `formatXml` | `src/utils/converters/xml.ts` |
| YAML | `formatYaml` | `src/utils/converters/yaml.ts` |
| SQL | sql-formatter library | External |
| JS/CSS/HTML | `formatJavaScript`, `formatCSS`, `formatHTML` | `src/utils/formatters/code.ts` |

### Converters
| Tool | Functions | Source |
|------|-----------|--------|
| JSON ↔ YAML | `jsonToYaml`, `yamlToJson` | `src/utils/converters/yaml.ts` |
| JSON ↔ XML | `jsonToXml`, `xmlToJson` | `src/utils/converters/xml.ts` |
| JSON ↔ CSV | `jsonToCsv`, `csvToJson` | `src/utils/converters/csv.ts` |
| JSON → TypeScript | `jsonToTypeScript` | `src/utils/converters/typescript.ts` |
| Markdown ↔ HTML | `markdownToHtml`, `htmlToMarkdown` | `src/utils/converters/markdown.ts` |
| Base64 | `encodeBase64`, `decodeBase64` | `src/utils/converters/base64.ts` |
| URL | `encodeUrl`, `decodeUrl` | `src/utils/converters/url.ts` |

### Bonus: Text & Generators
- Case conversion: `toCamelCase`, `toSnakeCase`, `toKebabCase`, `toPascalCase`
- UUID generation: `generateUuidV4`
- Hash generation: `generateSHA256`, `generateMD5`

---

## Project Structure

```
devtools_hub/                      # Existing project
├── src/                           # Existing web app source
│   └── utils/                     # Core utilities (already exist - reuse directly)
│
├── extensions/                    # NEW: Extensions folder
│   ├── core/                      # Shared utilities package
│   │   ├── src/
│   │   │   └── index.ts           # Re-exports from src/utils
│   │   └── package.json
│   │
│   ├── chrome/                    # Chrome Extension (Manifest V3)
│   │   ├── manifest.json
│   │   ├── src/
│   │   │   ├── background/        # Service worker
│   │   │   ├── popup/             # React popup UI
│   │   │   ├── content/           # Content script
│   │   │   └── options/           # Settings page
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── vscode/                    # VS Code Extension
│       ├── src/
│       │   ├── extension.ts       # Entry point
│       │   ├── commands/          # Command handlers
│       │   └── providers/         # Status bar, etc.
│       ├── esbuild.config.js
│       └── package.json
│
├── package.json                   # Update with workspaces
└── pnpm-workspace.yaml            # NEW: Workspace config
```

---

## Chrome Extension Features

### Context Menu
Right-click on selected text to access:
- **Formatters**: Format JSON, Minify JSON, Format XML, etc.
- **Converters**: JSON→YAML, YAML→JSON, JSON→XML, etc.
- **Encoders**: Base64 Encode/Decode, URL Encode/Decode
- **Case**: camelCase, snake_case, kebab-case, PascalCase

### Popup UI
- Tool selector tabs (JSON, YAML, Base64, UUID, etc.)
- Input/output textareas
- One-click copy to clipboard
- Paste from clipboard button

### Keyboard Shortcuts
- `Ctrl+Shift+J` / `Cmd+Shift+J`: Format JSON
- `Ctrl+Shift+B` / `Cmd+Shift+B`: Toggle Base64
- `Ctrl+Shift+U` / `Cmd+Shift+U`: Generate UUID

---

## VS Code Extension Features

### Commands (Command Palette)
All commands prefixed with "DevTools Hub:":
- Format JSON / Minify JSON
- Convert JSON to YAML / YAML to JSON
- Convert JSON to XML / XML to JSON
- Generate TypeScript from JSON
- Encode/Decode Base64
- URL Encode/Decode
- Generate UUID
- Convert case (camelCase, snake_case, etc.)

### Context Menu
Right-click in editor → "DevTools Hub" submenu with common actions

### Keyboard Shortcuts
- `Ctrl+Alt+J` / `Cmd+Alt+J`: Format JSON
- `Ctrl+Alt+U` / `Cmd+Alt+U`: Generate UUID
- `Ctrl+Alt+F` / `Cmd+Alt+F`: Auto-format selection

### Status Bar
Quick access button with dropdown picker

---

## Implementation Phases

### Phase 1: Project Setup
1. Create `extensions/` folder structure
2. Add pnpm workspace configuration to root
3. Create `extensions/core/` package that re-exports from `src/utils/`
4. Configure tsup for CJS/ESM builds
5. Verify workspace linking works

### Phase 2: Both Extensions (Parallel Development)

**Chrome Extension (`extensions/chrome/`)**:
1. Create Manifest V3 configuration
2. Implement service worker with context menus
3. Build content script for text replacement
4. Create React popup UI with all 13 tools
5. Add keyboard shortcuts
6. Create options page

**VS Code Extension (`extensions/vscode/`)**:
1. Configure package.json with commands/menus/keybindings
2. Implement command handlers for all 13 tools
3. Create editor utilities (selection, replacement)
4. Add status bar integration with quick picker
5. Add configuration options

### Phase 3: Testing & Polish
1. Test Chrome extension across websites
2. Test VS Code extension in Extension Development Host
3. Create icons and branding assets
4. Write README for each extension

### Phase 4: Release
1. Build production bundles
2. Submit Chrome extension to Chrome Web Store
3. Publish VS Code extension to Marketplace

---

## Key Files to Reference

| Purpose | Path |
|---------|------|
| JSON utilities | `src/utils/formatters/json.ts` |
| YAML utilities | `src/utils/converters/yaml.ts` |
| XML utilities | `src/utils/converters/xml.ts` |
| CSV utilities | `src/utils/converters/csv.ts` |
| TypeScript gen | `src/utils/converters/typescript.ts` |
| Markdown utils | `src/utils/converters/markdown.ts` |
| Base64 utils | `src/utils/converters/base64.ts` |
| URL utils | `src/utils/converters/url.ts` |
| Case utils | `src/utils/text/case.ts` |
| Hash utils | `src/utils/generators/hash.ts` |
| UUID utils | `src/utils/generators/uuid.ts` |
| Dependencies | `package.json` |

---

## Verification Plan

1. **Core Package**: Run `npm run test` to verify all extracted utilities work
2. **Chrome Extension**:
   - Load unpacked extension in Chrome
   - Test context menu on various websites
   - Test popup UI with sample data
   - Verify keyboard shortcuts
3. **VS Code Extension**:
   - Press F5 to launch Extension Development Host
   - Test commands via Command Palette
   - Test context menu in editor
   - Verify keyboard shortcuts

---

## Acceptance Criteria

### Chrome Extension Acceptance Criteria

#### AC-1: Extension Loads Successfully
- [ ] Extension installs without errors
- [ ] Extension icon appears in Chrome toolbar
- [ ] No console errors on extension load
- [ ] Service worker activates correctly

#### AC-2: Popup UI Functionality
- [ ] Popup opens when clicking extension icon
- [ ] All 13 tools are accessible via tabs/navigation
- [ ] Input textarea accepts text input
- [ ] Output textarea displays results
- [ ] Copy button copies output to clipboard
- [ ] Paste button pastes from clipboard to input
- [ ] Error messages display for invalid input

#### AC-3: Context Menu Integration
- [ ] "DevTools Hub" menu appears on right-click with selected text
- [ ] All formatter options work (JSON, XML, YAML, SQL, JS/CSS/HTML)
- [ ] All converter options work (JSON↔YAML, JSON↔XML, JSON↔CSV, etc.)
- [ ] All encoder options work (Base64, URL)
- [ ] All case converters work (camelCase, snake_case, kebab-case, PascalCase)
- [ ] Selected text is replaced with transformed result
- [ ] Works on editable fields (input, textarea, contenteditable)

#### AC-4: Keyboard Shortcuts
- [ ] `Ctrl+Shift+J` / `Cmd+Shift+J` formats JSON
- [ ] `Ctrl+Shift+B` / `Cmd+Shift+B` toggles Base64 encode/decode
- [ ] `Ctrl+Shift+U` / `Cmd+Shift+U` generates and inserts UUID
- [ ] Shortcuts work when text is selected

#### AC-5: Cross-Site Compatibility
- [ ] Works on GitHub (code blocks, text areas)
- [ ] Works on Stack Overflow (answer editors)
- [ ] Works on Google Docs (if applicable)
- [ ] Works on generic HTML forms
- [ ] Works on localhost development sites

### Chrome Extension E2E Tests (Playwright)

```typescript
// extensions/chrome/e2e/extension.spec.ts
import { test, expect, chromium } from '@playwright/test';
import path from 'path';

const extensionPath = path.join(__dirname, '../dist');

test.describe('Chrome Extension E2E Tests', () => {
  test.beforeAll(async () => {
    // Launch browser with extension loaded
  });

  test('AC-1: Extension loads and icon is visible', async () => {
    const browser = await chromium.launchPersistentContext('', {
      headless: false, // Extensions require non-headless mode
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    const page = await browser.newPage();
    // Verify extension loaded
    const extensions = await page.evaluate(() => {
      return chrome.runtime.getManifest();
    });
    expect(extensions.name).toBe('DevTools Hub');
    await browser.close();
  });

  test('AC-2: Popup opens and displays tools', async ({ context }) => {
    const extensionId = 'your-extension-id'; // Get from chrome://extensions
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);

    // Verify tool tabs exist
    await expect(popupPage.locator('button:has-text("JSON")')).toBeVisible();
    await expect(popupPage.locator('button:has-text("Base64")')).toBeVisible();
    await expect(popupPage.locator('button:has-text("UUID")')).toBeVisible();
  });

  test('AC-2: JSON formatting works in popup', async ({ context }) => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup/index.html`);

    // Input minified JSON
    await popupPage.fill('textarea[placeholder*="Input"]', '{"name":"test","value":123}');
    await popupPage.click('button:has-text("Format")');

    // Verify formatted output
    const output = await popupPage.locator('textarea[readonly]').inputValue();
    expect(output).toContain('\n');
    expect(output).toContain('  "name"');
  });

  test('AC-3: Context menu appears on selection', async ({ page }) => {
    await page.goto('https://example.com');

    // Select text and right-click
    await page.evaluate(() => {
      const textarea = document.createElement('textarea');
      textarea.value = '{"test":true}';
      textarea.id = 'test-input';
      document.body.appendChild(textarea);
    });

    await page.selectText('#test-input');
    await page.click('#test-input', { button: 'right' });

    // Context menu verification requires special handling
    // as Playwright cannot directly interact with browser context menus
  });

  test('AC-4: Keyboard shortcut formats JSON', async ({ page }) => {
    await page.goto('about:blank');

    await page.evaluate(() => {
      const textarea = document.createElement('textarea');
      textarea.value = '{"a":1}';
      textarea.id = 'test';
      document.body.appendChild(textarea);
      textarea.select();
    });

    // Trigger keyboard shortcut
    await page.keyboard.press('Control+Shift+J');

    const value = await page.locator('#test').inputValue();
    expect(value).toContain('\n');
  });

  test('AC-5: Works on GitHub code blocks', async ({ page }) => {
    await page.goto('https://github.com');
    // Test on GitHub's interface
  });
});
```

#### Test Commands
```bash
# Run Chrome extension E2E tests
cd extensions/chrome
npm run test:e2e

# Run with visible browser
npm run test:e2e:headed

# Run specific test
npm run test:e2e -- --grep "AC-2"
```

---

### VS Code Extension Acceptance Criteria

#### AC-6: Extension Activates
- [ ] Extension installs without errors
- [ ] Extension activates on VS Code startup
- [ ] All commands register in Command Palette
- [ ] No errors in Extension Host output

#### AC-7: Command Palette Commands
- [ ] "DevTools Hub: Format JSON" formats selected/entire JSON
- [ ] "DevTools Hub: Minify JSON" minifies JSON
- [ ] "DevTools Hub: JSON to YAML" converts correctly
- [ ] "DevTools Hub: YAML to JSON" converts correctly
- [ ] "DevTools Hub: JSON to XML" converts correctly
- [ ] "DevTools Hub: XML to JSON" converts correctly
- [ ] "DevTools Hub: Generate TypeScript" creates interfaces
- [ ] "DevTools Hub: Encode Base64" encodes selection
- [ ] "DevTools Hub: Decode Base64" decodes selection
- [ ] "DevTools Hub: URL Encode" encodes selection
- [ ] "DevTools Hub: URL Decode" decodes selection
- [ ] "DevTools Hub: Generate UUID" inserts UUID at cursor
- [ ] "DevTools Hub: To camelCase" converts text
- [ ] "DevTools Hub: To snake_case" converts text
- [ ] "DevTools Hub: To kebab-case" converts text
- [ ] "DevTools Hub: To PascalCase" converts text

#### AC-8: Editor Context Menu
- [ ] "DevTools Hub" submenu appears on right-click
- [ ] Common actions available in submenu
- [ ] Actions work on selected text
- [ ] Actions work on entire document when no selection

#### AC-9: Keyboard Shortcuts
- [ ] `Ctrl+Alt+J` / `Cmd+Alt+J` formats JSON
- [ ] `Ctrl+Alt+U` / `Cmd+Alt+U` generates UUID
- [ ] `Ctrl+Alt+F` / `Cmd+Alt+F` auto-formats selection

#### AC-10: Status Bar Integration
- [ ] "DevTools" button appears in status bar
- [ ] Clicking shows quick pick menu
- [ ] All tools accessible from quick pick

#### AC-11: Error Handling
- [ ] Invalid JSON shows error notification
- [ ] Invalid Base64 shows error notification
- [ ] Invalid XML shows error notification
- [ ] Errors don't crash the extension

### VS Code Extension Tests

```typescript
// extensions/vscode/src/test/extension.test.ts
import * as vscode from 'vscode';
import * as assert from 'assert';

suite('VS Code Extension Tests', () => {

  test('AC-6: Extension activates', async () => {
    const extension = vscode.extensions.getExtension('devtools-hub.devtools-hub');
    assert.ok(extension);
    await extension.activate();
    assert.strictEqual(extension.isActive, true);
  });

  test('AC-7: Format JSON command works', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{"name":"test","value":123}',
      language: 'json'
    });
    const editor = await vscode.window.showTextDocument(doc);

    // Select all
    editor.selection = new vscode.Selection(0, 0, 0, doc.getText().length);

    await vscode.commands.executeCommand('devtoolsHub.formatJson');

    const text = editor.document.getText();
    assert.ok(text.includes('\n'));
    assert.ok(text.includes('  "name"'));
  });

  test('AC-7: JSON to YAML conversion works', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: '{"name":"test","value":123}',
      language: 'json'
    });
    const editor = await vscode.window.showTextDocument(doc);
    editor.selection = new vscode.Selection(0, 0, 0, doc.getText().length);

    await vscode.commands.executeCommand('devtoolsHub.jsonToYaml');

    const text = editor.document.getText();
    assert.ok(text.includes('name: test'));
    assert.ok(text.includes('value: 123'));
  });

  test('AC-7: Generate UUID inserts valid UUID', async () => {
    const doc = await vscode.workspace.openTextDocument({ content: '' });
    const editor = await vscode.window.showTextDocument(doc);

    await vscode.commands.executeCommand('devtoolsHub.generateUuid');

    const text = editor.document.getText();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.ok(uuidRegex.test(text.trim()));
  });

  test('AC-11: Invalid JSON shows error', async () => {
    const doc = await vscode.workspace.openTextDocument({
      content: 'not valid json',
      language: 'json'
    });
    const editor = await vscode.window.showTextDocument(doc);
    editor.selection = new vscode.Selection(0, 0, 0, doc.getText().length);

    // Should show error notification (check via spy or message handler)
    await vscode.commands.executeCommand('devtoolsHub.formatJson');

    // Text should remain unchanged on error
    assert.strictEqual(editor.document.getText(), 'not valid json');
  });
});
```

#### Test Commands
```bash
# Run VS Code extension tests
cd extensions/vscode
npm run test

# Run with coverage
npm run test:coverage
```

---

### Core Package Acceptance Criteria

#### AC-12: All Utilities Work
- [ ] All formatters produce correct output
- [ ] All converters handle bidirectional conversion
- [ ] All encoders handle encode/decode
- [ ] All generators produce valid output
- [ ] All text utilities work correctly
- [ ] Error handling works for invalid input

#### AC-13: Build Outputs
- [ ] CJS bundle generated (`dist/index.js`)
- [ ] ESM bundle generated (`dist/index.mjs`)
- [ ] TypeScript declarations generated (`dist/index.d.ts`)
- [ ] All exports accessible from both bundle formats

#### Test Commands
```bash
# Run core package tests
cd extensions/core
npm run test

# Run with coverage
npm run test:coverage
```

---

### CI/CD Acceptance Criteria

#### AC-14: Automated Testing
- [ ] Core package tests run on PR
- [ ] Chrome extension E2E tests run on PR
- [ ] VS Code extension tests run on PR
- [ ] All tests pass before merge

#### AC-15: Build Artifacts
- [ ] Chrome extension `.zip` generated for Chrome Web Store
- [ ] VS Code extension `.vsix` generated for Marketplace
- [ ] Release artifacts attached to GitHub releases

---

## Dependencies

```json
{
  "js-yaml": "^4.1.1",
  "fast-xml-parser": "^5.3.2",
  "papaparse": "^5.5.3",
  "markdown-it": "^14.1.0",
  "turndown": "^7.2.2",
  "js-beautify": "^1.15.4",
  "sql-formatter": "^15.6.10",
  "crypto-js": "^4.2.0",
  "uuid": "^13.0.0"
}
```

### Dev Dependencies for Testing
```json
{
  "@playwright/test": "^1.40.0",
  "@vscode/test-electron": "^2.3.8",
  "vitest": "^4.0.16"
}
```
