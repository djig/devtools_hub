# DevTools Hub

A modern, responsive developer utility website built with Vite, React, and TypeScript. Features **47+ tools** running entirely in your browser - private, fast, and free.

## Features

- **47+ Developer Tools** across 9 categories
- **100% Private** - All tools run locally in your browser
- **Dark/Light/System Mode** with automatic persistence
- **Favorites & Recent Tools** - Track your most-used utilities
- **Real-time Search** - Find tools instantly with Command Palette (Cmd+K)
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Fast & Modern** - Built with Vite, React 19, and TypeScript
- **Comprehensive Testing** - Unit tests, E2E tests with Playwright

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:run

# Run E2E tests
npm run e2e
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run e2e` | Run Playwright E2E tests (headless) |
| `npm run e2e:headed` | Run E2E tests with browser visible |
| `npm run e2e:ui` | Run E2E tests with Playwright UI |

## Tool Categories

### Formatters & Validators
- JSON Formatter & Validator
- XML Formatter
- YAML Formatter
- SQL Formatter
- JSON Schema Validator
- JSON Diff

### Converters
- JSON to YAML / YAML to JSON
- JSON to XML / XML to JSON
- JSON to CSV / CSV to JSON
- JSON to Schema

### Encoders/Decoders
- Base64 Encoder/Decoder
- URL Encoder/Decoder
- JWT Decoder
- HTML Entity Encoder/Decoder
- Number Base Converter

### Text Tools
- Case Converter (camelCase, snake_case, etc.)
- Text Counter
- Lorem Ipsum Generator
- Line Sorter
- Text Diff
- Markdown Editor
- Regex Tester

### Generators
- UUID Generator
- Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
- QR Code Generator
- Random Data Generator

### Date & Time
- Epoch Converter
- Timezone Converter
- Date Calculator
- Duration Calculator

### Calculators
- Percentage Calculator
- Unit Converter
- Aspect Ratio Calculator

### Developer Tools
- Color Converter
- CSS/JS/HTML Minifiers
- Cron Parser
- HTTP Status Codes
- Image to Base64
- Meta Tag Generator

### Network & Security
- IP Address Info
- SSL Certificate Decoder
- CSP Generator

## Tech Stack

- **Vite 7.x** - Lightning-fast build tool
- **React 19** - UI library with TypeScript
- **React Router v7** - Client-side routing
- **Tailwind CSS v3** - Utility-first styling
- **Zustand** - Lightweight state management
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing framework
- **Husky** - Git hooks for pre-commit checks

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Footer, Layout
│   ├── ui/              # Button, Input, Card, Textarea
│   └── shared/          # CopyButton, ToolCard, ErrorBoundary
├── pages/
│   └── tools/           # All tool implementations
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
│   ├── converters/      # Format conversion utilities
│   ├── formatters/      # Code formatting utilities
│   ├── generators/      # UUID, hash generation
│   └── text/            # Text manipulation utilities
├── store/               # Zustand store
├── types/               # TypeScript definitions
├── data/                # Tool registry
├── test/                # Test setup and utilities
└── e2e/                 # Playwright E2E tests
```

## Testing

### Unit Tests

```bash
# Run all unit tests
npm run test:run

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test
```

### E2E Tests

```bash
# Run headless
npm run e2e

# Run with browser visible
npm run e2e:headed

# Run with Playwright UI
npm run e2e:ui
```

## Pre-commit Hooks

The project uses Husky for pre-commit hooks that run:
1. **lint-staged** - ESLint fix on staged files
2. **npm run lint** - Full lint check
3. **npm run build** - TypeScript + Vite build
4. **npm run test:run** - Unit tests

## Deployment

Build and deploy to any static host:

```bash
npm run build
# Deploy dist/ folder
```

Compatible with:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Make your changes
4. Ensure all tests pass: `npm run test:run && npm run e2e`
5. Submit a pull request

## License

MIT
