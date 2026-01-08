# DevTools Hub Comprehensive Refactoring Plan

## Overview
A comprehensive rewrite of the DevTools Hub React application focusing on clean code, better abstractions, React 19 Compiler, essential tests, and CI/CD pipeline.

## Current State
- **React 19.2.1**, Vite 7.2.4, TypeScript 5.9.3, Tailwind CSS 3.4.18, Zustand 5.0.8
- 97 source files (18 utils, 18 components, 45+ tool pages, 3 hooks)
- **Zero tests**, no CI/CD, no pre-commit hooks

---

## Phase 1: Constants & Shared Utilities

### 1.1 Create Constants File
**New file:** `src/constants/index.ts`
```typescript
export const APP_CONFIG = {
  MAX_RECENT_TOOLS: 10,
  MAX_SEARCH_RESULTS: 8,
  MAX_FAVORITES_DISPLAY: 5,
  COPY_TIMEOUT_MS: 2000,
} as const;

export const STORAGE_KEYS = {
  APP_STORE: 'devtools-hub-storage',
} as const;

export const ICON_GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-violet-500',
  'from-teal-500 to-cyan-500',
  'from-red-500 to-orange-500',
] as const;

export const CARD_GRADIENTS = [
  'from-blue-500/20 to-cyan-500/10 hover:from-blue-500/30 hover:to-cyan-500/20',
  'from-purple-500/20 to-pink-500/10 hover:from-purple-500/30 hover:to-pink-500/20',
  'from-green-500/20 to-emerald-500/10 hover:from-green-500/30 hover:to-emerald-500/20',
  'from-orange-500/20 to-amber-500/10 hover:from-orange-500/30 hover:to-amber-500/20',
  'from-pink-500/20 to-rose-500/10 hover:from-pink-500/30 hover:to-rose-500/20',
  'from-indigo-500/20 to-violet-500/10 hover:from-indigo-500/30 hover:to-violet-500/20',
  'from-teal-500/20 to-cyan-500/10 hover:from-teal-500/30 hover:to-cyan-500/20',
  'from-red-500/20 to-orange-500/10 hover:from-red-500/30 hover:to-orange-500/20',
] as const;
```

### 1.2 Extract Gradient Utilities
**New file:** `src/utils/gradients.ts`

Extract duplicated `getIconGradient()` function from:
- `src/components/shared/CommandPalette.tsx` (lines 8-21)
- `src/components/layouts/ToolPageLayout.tsx`
- `src/components/shared/ToolCard.tsx`

```typescript
import { ICON_GRADIENTS, CARD_GRADIENTS } from '../constants';

export function getIconGradient(toolId: string): string {
  const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ICON_GRADIENTS[hash % ICON_GRADIENTS.length];
}

export function getCardGradient(toolId: string): string {
  const hash = toolId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CARD_GRADIENTS[hash % CARD_GRADIENTS.length];
}
```

### 1.3 Create Theme Utilities
**New file:** `src/utils/theme.ts`

Extract theme logic from `src/store/useAppStore.ts`:
```typescript
import type { Theme } from '../types';

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  root.classList.add(effectiveTheme);
}

export function initializeTheme(theme: Theme): void {
  applyTheme(theme);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme === 'system') applyTheme('system');
  });
}
```

---

## Phase 2: Custom Hooks

### 2.1 New Hooks to Create

| Hook | Purpose | Replaces |
|------|---------|----------|
| `useKeyboardShortcut` | Unified keyboard handlers | Duplicate listeners in Header.tsx, CommandPalette.tsx |
| `useTheme` | Theme state + resolved theme | Direct store access in multiple components |
| `useToolTracking` | Auto-track tool usage | Repeated useEffect in tool pages |

### 2.2 useKeyboardShortcut Hook
**New file:** `src/hooks/useKeyboardShortcut.ts`
```typescript
import { useEffect, useCallback } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void
): void {
  const { key, ctrlKey = false, metaKey = false, enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      if ((ctrlKey || metaKey) && (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === key.toLowerCase()) {
        if (preventDefault) event.preventDefault();
        callback();
      }
    },
    [key, ctrlKey, metaKey, enabled, preventDefault, callback]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

### 2.3 useTheme Hook
**New file:** `src/hooks/useTheme.ts`
```typescript
import { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import type { Theme } from '../types';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme } = useAppStore();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light'
  );

  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return { theme, resolvedTheme: theme === 'system' ? systemTheme : theme, setTheme };
}
```

### 2.4 useToolTracking Hook
**New file:** `src/hooks/useToolTracking.ts`
```typescript
import { useEffect } from 'react';
import useAppStore from '../store/useAppStore';

export function useToolTracking(toolId: string): void {
  const addRecentTool = useAppStore((state) => state.addRecentTool);
  useEffect(() => {
    addRecentTool(toolId);
  }, [toolId, addRecentTool]);
}
```

### 2.5 Enhanced useClipboard Hook
**Modify:** `src/hooks/useClipboard.ts`
- Add `timeout` option
- Add `showToast` option
- Add `successMessage` / `errorMessage` options

### 2.6 Create Barrel Export
**New file:** `src/hooks/index.ts`
```typescript
export { useClipboard } from './useClipboard';
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useKeyboardShortcut } from './useKeyboardShortcut';
export { useToolTracking } from './useToolTracking';
export { useTheme } from './useTheme';
```

---

## Phase 3: Component Refactoring

### 3.1 Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/Header.tsx` | Use `useKeyboardShortcut`, `useTheme` |
| `src/components/shared/CommandPalette.tsx` | Use `useKeyboardShortcut`, import `getIconGradient` from utils |
| `src/components/layouts/ToolPageLayout.tsx` | Import `getIconGradient`, use enhanced `useClipboard` |
| `src/components/shared/ToolCard.tsx` | Import gradient functions from utils |
| `src/store/useAppStore.ts` | Use constants, extract theme logic to utils |
| `src/App.tsx` | Wrap with ErrorBoundary |

### 3.2 New Components to Create

**`src/components/shared/ErrorBoundary.tsx`**
```typescript
import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <Card className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={this.handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </Card>
      );
    }
    return this.props.children;
  }
}
```

**`src/components/shared/ToolErrorCard.tsx`**
- Reusable error display for tools

**`src/components/shared/ToolListItem.tsx`**
- Extract from CommandPalette repeated button structure

---

## Phase 4: React 19 Compiler

### 4.1 Install Compiler
```bash
npm install --save-dev babel-plugin-react-compiler
```

### 4.2 Update Vite Config
**Modify:** `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
});
```

### 4.3 Update TypeScript Config
**Modify:** `tsconfig.app.json` - Add path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

---

## Phase 5: Testing Infrastructure

### 5.1 Install Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 happy-dom
```

### 5.2 New Files to Create

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Test configuration |
| `src/test/setup.ts` | Test setup (mocks for matchMedia, clipboard, localStorage) |
| `src/test/test-utils.tsx` | Custom render with providers |

### 5.3 Vitest Configuration
**New file:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/main.tsx'],
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
});
```

### 5.4 Test Files Priority

**High Priority - Pure Utilities:**
- `src/utils/formatters/json.test.ts`
- `src/utils/text/case.test.ts`
- `src/utils/generators/uuid.test.ts`
- `src/utils/generators/hash.test.ts`
- `src/utils/converters/base64.test.ts`
- `src/utils/gradients.test.ts`

**High Priority - Hooks:**
- `src/hooks/useClipboard.test.ts`
- `src/hooks/useDebounce.test.ts`
- `src/hooks/useKeyboardShortcut.test.ts`

**High Priority - Store:**
- `src/store/useAppStore.test.ts`

**Medium Priority - Components:**
- `src/components/shared/CopyButton.test.tsx`
- `src/components/shared/ErrorBoundary.test.tsx`
- `src/components/ui/Button.test.tsx`

### 5.5 Update package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Phase 6: CI/CD & Pre-commit Hooks

### 6.1 Install Husky
```bash
npm install --save-dev husky lint-staged
npx husky init
```

### 6.2 Pre-commit Hook
**New file:** `.husky/pre-commit`
```bash
npx lint-staged
```

### 6.3 lint-staged Config
**Add to package.json:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "vitest related --run"]
  }
}
```

### 6.4 GitHub Actions
**New file:** `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:ci

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

---

## Final Directory Structure

```
src/
├── constants/
│   └── index.ts              # NEW
├── components/
│   ├── layout/
│   ├── shared/
│   │   ├── ErrorBoundary.tsx     # NEW
│   │   ├── ToolErrorCard.tsx     # NEW
│   │   ├── ToolListItem.tsx      # NEW
│   │   └── ...
│   ├── tool-layouts/         # RENAMED from layouts
│   └── ui/
├── hooks/
│   ├── index.ts              # NEW (barrel export)
│   ├── useKeyboardShortcut.ts    # NEW
│   ├── useTheme.ts               # NEW
│   ├── useToolTracking.ts        # NEW
│   └── ...
├── test/
│   ├── setup.ts              # NEW
│   └── test-utils.tsx        # NEW
├── utils/
│   ├── gradients.ts          # NEW
│   ├── theme.ts              # NEW
│   └── ...
└── ...
```

---

## Implementation Order

### Step 1: Foundation
1. Create `src/constants/index.ts`
2. Create `src/utils/gradients.ts`
3. Create `src/utils/theme.ts`

### Step 2: Hooks
4. Create `src/hooks/useKeyboardShortcut.ts`
5. Create `src/hooks/useTheme.ts`
6. Create `src/hooks/useToolTracking.ts`
7. Enhance `src/hooks/useClipboard.ts`
8. Create `src/hooks/index.ts`

### Step 3: Store & Types
9. Update `src/types/index.ts` (fix `ComponentType<any>`)
10. Refactor `src/store/useAppStore.ts`

### Step 4: Components
11. Refactor `src/components/layout/Header.tsx`
12. Refactor `src/components/shared/CommandPalette.tsx`
13. Refactor `src/components/layouts/ToolPageLayout.tsx`
14. Refactor `src/components/shared/ToolCard.tsx`
15. Create `src/components/shared/ErrorBoundary.tsx`
16. Update `src/App.tsx` (add ErrorBoundary)

### Step 5: React Compiler
17. Install `babel-plugin-react-compiler`
18. Update `vite.config.ts`
19. Update `tsconfig.app.json`

### Step 6: Testing
20. Install test dependencies
21. Create `vitest.config.ts`
22. Create `src/test/setup.ts`
23. Create `src/test/test-utils.tsx`
24. Write utility tests
25. Write hook tests
26. Write store tests
27. Write component tests
28. Update `package.json` scripts

### Step 7: CI/CD
29. Install husky & lint-staged
30. Create `.husky/pre-commit`
31. Add lint-staged to `package.json`
32. Create `.github/workflows/ci.yml`

---

## Verification

After implementation, verify by:
1. `npm run lint` - No ESLint errors
2. `npm run typecheck` - No TypeScript errors
3. `npm run test:coverage` - All tests pass, 60%+ coverage
4. `npm run build` - Build succeeds
5. `npm run dev` - App runs correctly
6. Make a test commit - Pre-commit hooks run
7. Push to branch - CI pipeline passes

---

## Critical Files Summary

| Priority | File | Action |
|----------|------|--------|
| P0 | `src/constants/index.ts` | Create |
| P0 | `src/utils/gradients.ts` | Create |
| P0 | `src/utils/theme.ts` | Create |
| P0 | `src/hooks/useKeyboardShortcut.ts` | Create |
| P1 | `src/store/useAppStore.ts` | Refactor |
| P1 | `src/components/shared/CommandPalette.tsx` | Refactor |
| P1 | `src/components/layout/Header.tsx` | Refactor |
| P1 | `src/components/shared/ErrorBoundary.tsx` | Create |
| P2 | `vite.config.ts` | Update (React Compiler) |
| P2 | `vitest.config.ts` | Create |
| P3 | `.github/workflows/ci.yml` | Create |
