import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { CopyButton } from '../../../components/shared/CopyButton';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import MarkdownIt from 'markdown-it';
import Prism from 'prismjs';
import mermaid from 'mermaid';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import { FileText } from 'lucide-react';

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'monospace',
});

const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    // Handle Mermaid diagrams
    if (lang === 'mermaid') {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      return `<div class="mermaid" data-mermaid-id="${id}">${str}</div>`;
    }

    // Handle syntax highlighting with Prism
    if (lang && Prism.languages[lang]) {
      try {
        return `<pre class="language-${lang}"><code class="language-${lang}">${Prism.highlight(str, Prism.languages[lang], lang)}</code></pre>`;
      } catch {
        console.error('Prism highlighting error:', err);
      }
    }

    // Fallback for unknown languages
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    return `<pre class="language-${lang || 'plaintext'}"><code>${escaped}</code></pre>`;
  }
});

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('markdown-editor');
  }, [addRecentTool]);

  const html = useMemo(() => {
    try {
      return md.render(markdown);
    } catch {
      return '<p class="text-red-500">Error rendering markdown</p>';
    }
  }, [markdown]);

  // Render Mermaid diagrams after HTML is updated
  useEffect(() => {
    const renderMermaid = async () => {
      if (previewRef.current) {
        const mermaidElements = previewRef.current.querySelectorAll('.mermaid');

        for (const element of Array.from(mermaidElements)) {
          const code = element.textContent || '';
          const id = element.getAttribute('data-mermaid-id') || `mermaid-${Date.now()}`;

          try {
            const { svg } = await mermaid.render(id, code);
            element.innerHTML = svg;
          } catch {
            console.error('Mermaid rendering error:', err);
            element.innerHTML = `<pre class="text-red-500">Error rendering diagram: ${err}</pre>`;
          }
        }
      }
    };

    renderMermaid();
  }, [html]);

  const loadSample = () => {
    setMarkdown(`# Markdown Quick Demo

## Text Formatting
Make text **bold**, *italic*, or ***both***. Add ~~strikethrough~~ too!

## Lists
- Item 1
- Item 2
  - Nested item

1. First
2. Second

## Code

Inline: \`const x = 42;\`

### JavaScript
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));
\`\`\`

### JSON
\`\`\`json
{
  "name": "John",
  "age": 30,
  "active": true
}
\`\`\`

## Table
| Feature | Status |
|---------|--------|
| Code | ✅ |
| Diagrams | ✅ |

## Quote
> This is a blockquote with **bold** text.

## Mermaid Diagrams

### Flowchart
\`\`\`mermaid
flowchart LR
    A[Start] --> B{Check}
    B -->|Yes| C[Success]
    B -->|No| D[Retry]
    D --> A
\`\`\`

### Sequence
\`\`\`mermaid
sequenceDiagram
    User->>API: Request
    API->>DB: Query
    DB->>API: Data
    API->>User: Response
\`\`\`
`);
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Markdown Editor - Free Online Markdown Editor with Live Preview",
        description: "Edit and preview Markdown with live rendering online. Free Markdown editor with syntax highlighting and real-time preview. Supports GitHub Flavored Markdown (GFM).",
        keywords: "markdown editor, markdown preview, online markdown editor, md editor, markdown tool, markdown live preview, github markdown, free markdown editor",
        path: "/tools/markdown-editor"
      }}
      icon={FileText}
      title="Markdown Editor"
      description="Edit and preview Markdown with live rendering"
      category="text"
      actions={
        <>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
          <CopyButton text={markdown} />
        </>
      }
    >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Markdown Input (Raw)</label>
          <CodeEditor
            value={markdown}
            onChange={setMarkdown}
            language="markdown"
            placeholder="Enter your markdown here..."
            height="500px"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Preview (Rendered)</label>
          <div className="rounded-md border border-input overflow-hidden">
            <div
              ref={previewRef}
              className="prose prose-sm dark:prose-invert max-w-none min-h-[500px] h-[500px] overflow-auto p-6 bg-background"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="text-sm font-semibold mb-2">Markdown Syntax Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <p className="text-muted-foreground mb-1">Headings:</p>
            <p># H1, ## H2, ### H3</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Emphasis:</p>
            <p>**bold**, *italic*, ~~strikethrough~~</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Lists:</p>
            <p>- item or 1. item</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Links:</p>
            <p>[text](url)</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Code:</p>
            <p>`inline` or ```block```</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Quote:</p>
            <p>&gt; blockquote</p>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
