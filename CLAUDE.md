# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DevTools Hub is a browser-based developer utility website built with Vite, React 19, and TypeScript. All tools run entirely in the browser with no server-side processing.

**Live site:** https://engtoolshub.com

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # TypeScript check + production build
npm run typecheck        # TypeScript check only

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix

# Testing
npm run test:run         # Run unit tests once
npm run test             # Run unit tests in watch mode
npm run test:coverage    # Run tests with coverage report

# E2E Testing
npm run e2e              # Run Playwright tests (headless)
npm run e2e:headed       # Run with browser visible
npm run e2e:ui           # Run with Playwright UI
```

## Pre-commit Hooks

Husky runs these checks automatically on every commit:
1. lint-staged (ESLint fix on staged files)
2. Full lint check
3. TypeScript + Vite build
4. Unit tests

All checks must pass before commits are accepted.

## Architecture

### Tool Registry System

Tools are centrally registered in `src/data/tools.ts`:
- Each tool has: `id`, `name`, `description`, `category`, `path`, `icon`, `keywords`, and a lazy-loaded `component`
- Categories are defined in the same file with `categories` array
- Helper functions: `getToolById()`, `getToolsByCategory()`, `searchTools()`, `getToolByPath()`

### Adding a New Tool

1. Create utility functions in `src/utils/` (with tests)
2. Create the tool component in `src/pages/tools/<category>/`
3. Register in `src/data/tools.ts` with lazy import
4. Add E2E tests in `e2e/`

### Tool Page Pattern

All tool pages use `ToolPageLayout` from `src/components/layouts/ToolPageLayout.tsx`:

```tsx
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';

export default function MyTool() {
  // Tool must track recent usage on mount
  useEffect(() => {
    addRecentTool('tool-id');
  }, [addRecentTool]);

  return (
    <ToolPageLayout
      seo={{ title, description, keywords, path }}
      icon={IconComponent}
      title="Tool Name"
      description="Tool description"
      category="category-id"
      actions={<>Action buttons here</>}
    >
      {/* Tool UI content */}
    </ToolPageLayout>
  );
}
```

### State Management

Zustand store in `src/store/useAppStore.ts` manages:
- Theme (light/dark/system)
- Sidebar visibility
- Recent tools (max 10)
- Favorite tools

### Key Directories

- `src/components/ui/` - Reusable UI primitives (Button, Input, Card, CodeEditor)
- `src/components/shared/` - Shared components (CopyButton, ErrorBoundary, Breadcrumb)
- `src/components/layout/` - Layout components (Header, Sidebar, Footer)
- `src/hooks/` - Custom hooks (useClipboard, useDebounce, useKeyboardShortcut, useTheme)
- `src/utils/` - Utility functions organized by category (converters/, formatters/, generators/, text/)
- `src/constants/` - App-wide constants and configuration

### Types

Central type definitions in `src/types/index.ts`:
- `ToolCategory` - Union type of all category IDs
- `Tool` - Tool interface with all required properties
- `AppState` - Zustand store state and actions

### Styling

- Tailwind CSS v3 with custom configuration
- `src/lib/utils.ts` exports `cn()` for conditional class merging (uses clsx + tailwind-merge)
- Consistent use of CSS variables for theming (--primary, --muted-foreground, etc.)
