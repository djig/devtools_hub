# Contributing to DevTools Hub

First off, thank you for considering contributing to DevTools Hub! It's people like you that make DevTools Hub such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Include your browser and OS information**

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other tools if applicable**

### Adding New Tools

We love new tool contributions! Before starting work on a new tool:

1. **Open an issue first** to discuss the tool idea
2. **Check for duplicates** - ensure we don't already have a similar tool
3. **Follow the existing patterns** - look at how other tools are implemented

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** used throughout the project
3. **Write tests** for your changes
4. **Ensure all tests pass** before submitting
5. **Update documentation** if needed

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/devtools_hub.git
cd devtools_hub

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

```bash
# Run unit tests
npm run test:run

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix lint errors
npm run lint:fix

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Header, Footer)
│   ├── ui/              # UI primitives (Button, Input, Card)
│   └── shared/          # Shared components (CopyButton, ToolCard)
├── pages/
│   └── tools/           # Tool page components
├── hooks/               # Custom React hooks
├── utils/
│   ├── converters/      # Conversion utilities
│   ├── formatters/      # Formatting utilities
│   ├── generators/      # Generator utilities
│   └── text/            # Text manipulation utilities
├── store/               # Zustand store
├── types/               # TypeScript type definitions
├── data/                # Tool registry and configuration
└── e2e/                 # Playwright E2E tests
```

## Adding a New Tool

1. **Create the utility function** in the appropriate `src/utils/` subdirectory
2. **Add tests** for your utility function
3. **Create the tool component** in `src/pages/tools/`
4. **Register the tool** in `src/data/tools.ts`
5. **Add E2E tests** in `src/e2e/`

### Tool Component Template

```tsx
import { useState } from 'react';
import ToolPageLayout from '@/components/layouts/ToolPageLayout';

export default function MyNewTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleProcess = () => {
    // Your tool logic here
  };

  return (
    <ToolPageLayout
      title="My New Tool"
      description="Description of what this tool does"
    >
      {/* Your tool UI here */}
    </ToolPageLayout>
  );
}
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types for all function parameters and return values
- Avoid using `any` type

### React

- Use functional components with hooks
- Keep components small and focused
- Use the existing UI components from `src/components/ui/`

### Styling

- Use Tailwind CSS for styling
- Follow the existing design patterns
- Ensure responsive design for all screen sizes

### Testing

- Write unit tests for utility functions
- Write E2E tests for new tools
- Aim for good test coverage

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep the first line under 72 characters

Examples:
- `Add UUID generator tool`
- `Fix JSON formatter handling of nested arrays`
- `Update README with new tool documentation`

## Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically run:

1. ESLint fix on staged files
2. Full lint check
3. TypeScript + Vite build
4. Unit tests

Make sure all checks pass before committing.

## Questions?

Feel free to open an issue if you have any questions about contributing!

Thank you for your contribution!
