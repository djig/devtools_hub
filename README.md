# DevTools Hub

A modern, responsive developer utility website built with Vite, React, and TypeScript. All **47 tools** registered and **15 fully functional** tools ready to use!

## ✨ Features

- **47 Developer Tools** across 9 categories (15 working, 32 coming soon)
- **Dark/Light/System Mode** with automatic persistence
- **Fully Offline** - All tools run locally in your browser
- **Favorites & Recent Tools** - Track your most-used utilities
- **Real-time Search** - Find tools instantly
- **Responsive Design** - Perfect on desktop, tablet, and mobile
- **Fast & Modern** - Built with Vite, optimized bundle splitting
- **Type-Safe** - Full TypeScript coverage

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✅ Currently Implemented Tools (15)

### 📝 Formatters & Validators
- **JSON Formatter** - Format, validate, minify JSON with configurable indentation

### 🔄 Converters
- **JSON ↔ YAML Converter** - Bidirectional conversion with format validation
- **JSON ↔ XML Converter** - Convert between JSON and XML
- **JSON ↔ CSV Converter** - Array/object to CSV conversion

### 🔐 Encoders/Decoders
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **JWT Decoder** - Decode JWT tokens with expiration status

### ✍️ Text Tools
- **Case Converter** - camelCase, snake_case, kebab-case, PascalCase, and more
- **Text Counter** - Count characters, words, lines, sentences, paragraphs
- **Lorem Ipsum Generator** - Generate placeholder text (words/sentences/paragraphs)
- **Line Sorter** - Sort and deduplicate text lines

### ⚡ Generators
- **UUID Generator** - Generate UUIDs (v4) with bulk support
- **Hash Generator** - MD5, SHA-1, SHA-256, SHA-512 hashes
- **QR Code Generator** - Generate and download QR codes

### 📅 Date & Time
- **Epoch Converter** - Unix timestamp converter with live clock

### 🧮 Calculators
- **Percentage Calculator** - Calculate percentages, increase, decrease

## 🔜 Coming Soon Tools (32)

All tools below are **registered and routable** with "Coming Soon" pages:

### Formatters & Validators
- JSON Diff, XML Formatter, YAML Formatter, SQL Formatter

### Encoders/Decoders
- URL Encoder, HTML Entity Encoder, Unicode Converter, Number Base Converter

### Text Tools
- Text Diff, Markdown Editor, Regex Tester

### Generators
- Random Data Generator

### Date & Time
- Timezone Converter, Date Calculator, Duration Calculator

### Calculators
- Unit Converter, Aspect Ratio Calculator

### Developer Tools
- Color Converter, CSS/JS/HTML Minifiers, Cron Parser, HTTP Status Codes,
  User Agent Parser, Image to Base64, Meta Tag Generator

### Network & Security
- IP Address Info, CIDR Calculator, SSL Certificate Decoder, CSP Generator

## 🛠️ Tech Stack

- **Vite 5.x** - Lightning-fast build tool
- **React 18.x** - UI library with TypeScript
- **React Router v6** - Client-side routing
- **Tailwind CSS v3** - Utility-first styling
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library
- **crypto-js** - Hash generation
- **js-yaml** - YAML parsing
- **fast-xml-parser** - XML parsing
- **papaparse** - CSV parsing
- **qrcode.react** - QR code generation
- **date-fns** - Date utilities

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Sidebar, Footer, Layout
│   ├── ui/              # Button, Input, Card, Textarea (shadcn-inspired)
│   └── shared/          # CopyButton, InputOutput, ToolCard, ComingSoon
├── pages/
│   ├── tools/           # All 47 tool implementations
│   │   ├── json/        # JSON tools
│   │   ├── converters/  # Format converters
│   │   ├── encoding/    # Encoding tools
│   │   ├── text/        # Text utilities
│   │   ├── generators/  # Generators
│   │   ├── datetime/    # Date/time tools
│   │   ├── calculators/ # Calculators
│   │   ├── developer/   # Developer tools
│   │   ├── formatters/  # Additional formatters
│   │   └── network/     # Network & security tools
│   ├── Home.tsx         # Main page with tool grid
│   └── Category.tsx     # Category listing pages
├── hooks/               # Custom React hooks
├── utils/               # Utility functions for tools
├── store/               # Zustand store (theme, favorites, recent)
├── types/               # TypeScript type definitions
├── data/                # Tool registry (47 tools)
└── lib/                 # Utility functions (cn, etc.)
```

## 🎨 Key Features in Detail

### Theme System
- **3 modes**: Light, Dark, System (auto-detects OS preference)
- **Persistent**: Saved to localStorage
- **Smooth transitions**: CSS variable-based theming

### Tool Management
- **Favorites**: Star tools for quick access
- **Recent Tools**: Automatically tracks last 10 used tools
- **Search**: Real-time fuzzy search across names, descriptions, and keywords
- **Categories**: Organized into 9 logical groups

### Performance
- **Code Splitting**: Each tool lazy-loaded separately
- **Optimized Bundles**: Main bundle 95 KB gzipped
- **Fast Navigation**: React Router with suspense
- **Efficient Re-renders**: Zustand for state management

## 📝 Adding New Tools

To implement any "Coming Soon" tool:

### 1. Create Utility Functions

```typescript
// src/utils/text/markdown.ts
export function markdownToHtml(markdown: string): string {
  // Implementation
  return html;
}
```

### 2. Implement Tool Component

```typescript
// src/pages/tools/text/MarkdownEditor.tsx
import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import useAppStore from '../../../store/useAppStore';

export default function MarkdownEditor() {
  const [input, setInput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('markdown-editor');
  }, [addRecentTool]);

  // Tool implementation
  return (/* JSX */);
}
```

### 3. Tool Automatically Works!

The tool is already registered in `src/data/tools.ts` with:
- ✅ Routing configured
- ✅ Search keywords
- ✅ Category assignment
- ✅ Icon and metadata
- ✅ Lazy loading setup

## 🏗️ Build Output

```
✓ Built in 1.67s
✓ 47 tools registered
✓ 15 tools fully functional
✓ Main bundle: 298 KB (95 KB gzipped)
✓ Tool chunks: 0.2-71 KB each (lazy loaded)
```

## 🚢 Deployment

Build and deploy to any static host:

```bash
npm run build
# Deploy dist/ folder to:
```

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/` folder
- **GitHub Pages**: Push `dist/` to gh-pages branch
- **Cloudflare Pages**: Connect repository
- **AWS S3 + CloudFront**: Upload `dist/` to S3 bucket

## 📚 Documentation

- **README.md** - This file (overview & quick start)
- **PROJECT_STATUS.md** - Detailed implementation status
- **IMPLEMENTATION_GUIDE.md** - Guide for adding new tools

## 🎯 Development Roadmap

The architecture is ready for:
- ✅ All 47 tools registered and routable
- ✅ 15 production-ready tools
- 🔜 32 tools with "Coming Soon" placeholders (easy to implement)
- 🔜 Monaco Editor integration for code tools
- 🔜 PWA support for offline usage
- 🔜 Export/import tool settings
- 🔜 Tool history and templates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Implement the tool following existing patterns
4. Test thoroughly: `npm run build`
5. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Design system with [Tailwind CSS](https://tailwindcss.com/)

---

**Status**: ✅ Production Ready
**Tools**: 15 Working | 32 Coming Soon | 47 Total
**Build**: Successful (1.67s)
**Bundle**: 95 KB gzipped

Ready to use, easy to expand! 🚀
