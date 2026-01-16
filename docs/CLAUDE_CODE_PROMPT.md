# Claude Code Implementation Prompt

> **How to Use**: Copy everything below the line and paste it into Claude Code (web version at claude.ai/code)

---

## Running Without Interruption

Before pasting the prompt, configure Claude Code for autonomous execution:

### Option 1: Use `--dangerously-skip-permissions` (Recommended for this task)
```bash
claude --dangerously-skip-permissions
```
This skips all permission prompts. Only use in trusted projects.

### Option 2: Pre-approve permissions in settings
In Claude Code, type `/permissions` and add:
- `Bash(npm install:*)`
- `Bash(npm run:*)`
- `Bash(npx:*)`
- `Bash(mkdir:*)`
- `Write(*)`
- `Edit(*)`

### Option 3: Use "Yes to all" during session
When prompted, select "Yes, and don't ask again for this session"

---

## The Prompt

Copy everything below and paste into Claude Code:

---

# TASK: Implement Chrome & VS Code Extensions for DevTools Hub

You are implementing Chrome and VS Code extensions for DevTools Hub (https://engtoolshub.com). The project is already cloned and you're in the root directory.

## IMPORTANT INSTRUCTIONS

1. **DO NOT ASK QUESTIONS** - Make reasonable decisions and proceed
2. **COMPLETE THE ENTIRE IMPLEMENTATION** - Don't stop until all phases are done
3. **RUN TESTS AFTER EACH PHASE** - Verify everything works before moving on
4. **COMMIT AFTER EACH PHASE** - Create meaningful commits

## PROJECT CONTEXT

DevTools Hub is a browser-based developer utility website built with:
- Vite + React 19 + TypeScript
- All utilities are pure functions in `src/utils/`
- Existing tools: formatters, converters, encoders, generators, text utilities

## WHAT TO BUILD

Create two extensions inside `extensions/` folder:

### 1. Shared Core Package (`extensions/core/`)
Re-exports utilities from `src/utils/` for both extensions.

### 2. Chrome Extension (`extensions/chrome/`)
- Manifest V3
- Popup UI with all 13 tools
- Context menu on right-click
- Keyboard shortcuts
- Content script for text replacement

### 3. VS Code Extension (`extensions/vscode/`)
- Command Palette commands for all tools
- Editor context menu
- Keyboard shortcuts
- Status bar quick pick

## TOOLS TO INCLUDE (13 Total)

**Formatters:**
- JSON (format, minify, validate) - `src/utils/formatters/json.ts`
- XML - `src/utils/converters/xml.ts`
- YAML - `src/utils/converters/yaml.ts`
- JS/CSS/HTML - `src/utils/formatters/code.ts`

**Converters:**
- JSON ↔ YAML - `src/utils/converters/yaml.ts`
- JSON ↔ XML - `src/utils/converters/xml.ts`
- JSON ↔ CSV - `src/utils/converters/csv.ts`
- JSON → TypeScript - `src/utils/converters/typescript.ts`
- Markdown ↔ HTML - `src/utils/converters/markdown.ts`
- Base64 encode/decode - `src/utils/converters/base64.ts`
- URL encode/decode - `src/utils/converters/url.ts`

**Generators:**
- UUID - `src/utils/generators/uuid.ts`
- Hash (MD5, SHA256) - `src/utils/generators/hash.ts`

**Text:**
- Case converters - `src/utils/text/case.ts`

## IMPLEMENTATION PHASES

### PHASE 1: Project Setup

```bash
# Create folder structure
mkdir -p extensions/core/src
mkdir -p extensions/chrome/src/{background,popup,content,options}
mkdir -p extensions/chrome/public/icons
mkdir -p extensions/chrome/e2e
mkdir -p extensions/vscode/src/{commands,providers,test}
mkdir -p extensions/vscode/resources/icons
```

1. Create `pnpm-workspace.yaml` in root:
```yaml
packages:
  - 'extensions/*'
```

2. Update root `package.json` to add workspaces

3. Create `extensions/core/package.json`:
```json
{
  "name": "@devtools-hub/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest run"
  },
  "dependencies": {
    "js-yaml": "^4.1.1",
    "fast-xml-parser": "^5.3.2",
    "papaparse": "^5.5.3",
    "markdown-it": "^14.1.0",
    "turndown": "^7.2.2",
    "js-beautify": "^1.15.4",
    "sql-formatter": "^15.6.10",
    "crypto-js": "^4.2.0",
    "uuid": "^13.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "~5.9.3",
    "vitest": "^4.0.16"
  }
}
```

4. Create `extensions/core/src/index.ts` that re-exports from `../../src/utils/`

5. Build and test core package

### PHASE 2: Chrome Extension

1. Create `extensions/chrome/manifest.json` (Manifest V3):
```json
{
  "manifest_version": 3,
  "name": "DevTools Hub",
  "version": "1.0.0",
  "description": "Developer utilities: Format, convert, encode/decode data",
  "permissions": ["activeTab", "contextMenus", "storage", "clipboardRead", "clipboardWrite"],
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": { "16": "icons/icon-16.png", "48": "icons/icon-48.png", "128": "icons/icon-128.png" }
  },
  "background": { "service_worker": "background/service-worker.js", "type": "module" },
  "content_scripts": [{ "matches": ["<all_urls>"], "js": ["content/content-script.js"] }],
  "commands": {
    "format-json": { "suggested_key": { "default": "Ctrl+Shift+J", "mac": "Command+Shift+J" }, "description": "Format JSON" },
    "encode-base64": { "suggested_key": { "default": "Ctrl+Shift+B", "mac": "Command+Shift+B" }, "description": "Toggle Base64" },
    "generate-uuid": { "suggested_key": { "default": "Ctrl+Shift+U", "mac": "Command+Shift+U" }, "description": "Generate UUID" }
  }
}
```

2. Create service worker with context menu registration for all 13 tools
3. Create React popup UI with tabs for each tool category
4. Create content script for text selection/replacement
5. Create Vite build config
6. Create Playwright E2E tests in `extensions/chrome/e2e/`
7. Build and test

### PHASE 3: VS Code Extension

1. Create `extensions/vscode/package.json` with:
   - All 16+ commands (format, convert, encode, generate, case convert)
   - Context menu contributions
   - Keyboard bindings
   - Status bar contribution
   - Configuration options

2. Create `extensions/vscode/src/extension.ts` entry point
3. Create command handlers in `src/commands/`:
   - `formatters.ts` - JSON, XML, YAML, SQL formatting
   - `converters.ts` - All conversion commands
   - `encoders.ts` - Base64, URL encoding
   - `generators.ts` - UUID, hash generation
   - `text.ts` - Case conversion
4. Create `src/utils/editor.ts` for selection/replacement helpers
5. Create `src/providers/statusBar.ts` for quick pick menu
6. Create tests in `src/test/`
7. Build and test

### PHASE 4: Testing & Polish

1. Run all tests:
```bash
cd extensions/core && npm test
cd extensions/chrome && npm run test:e2e
cd extensions/vscode && npm test
```

2. Create simple icons (or placeholder icons)
3. Create README.md for each extension
4. Final build of all packages

## ACCEPTANCE CRITERIA CHECKLIST

After implementation, verify:

### Chrome Extension
- [ ] `npm run build` succeeds in extensions/chrome
- [ ] Extension loads in Chrome (chrome://extensions → Load unpacked)
- [ ] Popup shows all 13 tools
- [ ] Context menu appears on text selection
- [ ] JSON formatting works in popup
- [ ] Base64 encoding works
- [ ] UUID generation works

### VS Code Extension
- [ ] `npm run build` succeeds in extensions/vscode
- [ ] Extension loads in VS Code (F5 → Extension Development Host)
- [ ] All commands appear in Command Palette
- [ ] Format JSON command works
- [ ] Generate UUID command works
- [ ] Status bar button appears

### Tests
- [ ] Core package tests pass
- [ ] Chrome E2E tests pass (at least popup tests)
- [ ] VS Code extension tests pass

## FILE STRUCTURE TO CREATE

```
extensions/
├── core/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   └── index.ts              # Re-exports all utilities
│   └── tests/
│       └── index.test.ts
│
├── chrome/
│   ├── package.json
│   ├── manifest.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── src/
│   │   ├── background/
│   │   │   └── service-worker.ts
│   │   ├── popup/
│   │   │   ├── index.html
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   └── components/
│   │   │       └── ToolPanel.tsx
│   │   ├── content/
│   │   │   └── content-script.ts
│   │   └── styles/
│   │       └── popup.css
│   ├── public/
│   │   └── icons/
│   │       └── (icon files)
│   └── e2e/
│       ├── playwright.config.ts
│       └── extension.spec.ts
│
└── vscode/
    ├── package.json
    ├── tsconfig.json
    ├── esbuild.config.js
    ├── src/
    │   ├── extension.ts
    │   ├── commands/
    │   │   ├── index.ts
    │   │   ├── formatters.ts
    │   │   ├── converters.ts
    │   │   ├── encoders.ts
    │   │   ├── generators.ts
    │   │   └── text.ts
    │   ├── providers/
    │   │   └── statusBar.ts
    │   ├── utils/
    │   │   └── editor.ts
    │   └── test/
    │       └── extension.test.ts
    └── resources/
        └── icons/
```

## START NOW

Begin with Phase 1. Create the folder structure and core package first. Then proceed through each phase sequentially. Commit after each phase:

```bash
git add -A && git commit -m "feat(extensions): Phase 1 - Project setup and core package"
git add -A && git commit -m "feat(extensions): Phase 2 - Chrome extension"
git add -A && git commit -m "feat(extensions): Phase 3 - VS Code extension"
git add -A && git commit -m "feat(extensions): Phase 4 - Tests and polish"
```

Do not stop until all phases are complete and all acceptance criteria are verified.

---

**END OF PROMPT**
