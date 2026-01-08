import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { markdownToHtml, htmlToMarkdown } from '../../../utils/converters/markdown';
import { AlertCircle, ArrowRightLeft, FileText, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MarkdownHtmlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'md-to-html' | 'html-to-md'>('md-to-html');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('markdown-html-converter');
  }, [addRecentTool]);

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Please enter some content to convert');
      setOutput('');
      return;
    }

    try {
      if (mode === 'md-to-html') {
        const result = markdownToHtml(input);
        setOutput(result);
      } else {
        const result = htmlToMarkdown(input);
        setOutput(result);
      }
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'md-to-html' ? 'html-to-md' : 'md-to-html');
    setInput(output);
    setOutput(input);
  };

  const loadSample = () => {
    if (mode === 'md-to-html') {
      const sampleMd = `# Welcome to Markdown

This is a **bold** and *italic* text example.

## Features

- GitHub Flavored Markdown support
- ~~Strikethrough~~ text
- Task lists:
  - [x] Completed task
  - [ ] Pending task

### Code Example

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Table Example

| Name | Age | City |
|------|-----|------|
| John | 30 | NYC |
| Jane | 25 | LA |

> This is a blockquote

[Visit Example](https://example.com)`;
      setInput(sampleMd);
    } else {
      const sampleHtml = `<h1>Welcome to HTML</h1>

<p>This is a <strong>bold</strong> and <em>italic</em> text example.</p>

<h2>Features</h2>

<ul>
  <li>Convert HTML back to Markdown</li>
  <li><del>Strikethrough</del> support</li>
  <li>Tables and lists</li>
</ul>

<h3>Code Example</h3>

<pre><code>const greeting = "Hello, World!";
console.log(greeting);</code></pre>

<h3>Table Example</h3>

<table>
  <tr><th>Name</th><th>Age</th><th>City</th></tr>
  <tr><td>John</td><td>30</td><td>NYC</td></tr>
  <tr><td>Jane</td><td>25</td><td>LA</td></tr>
</table>

<blockquote>This is a blockquote</blockquote>

<p><a href="https://example.com">Visit Example</a></p>`;
      setInput(sampleHtml);
    }
  };

  const handleCopy = async () => {
    if (!output) {
      toast.error('No output to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "Markdown to HTML Converter - Free Online MD to HTML Converter",
        description: "Convert between Markdown and HTML formats instantly with our free online converter. Supports GitHub Flavored Markdown (GFM) including tables, task lists, and strikethrough. Bidirectional conversion - Markdown to HTML and HTML to Markdown.",
        keywords: "markdown to html, html to markdown, md to html, markdown converter, html converter, gfm converter, github markdown, markdown html tool, convert markdown, markdown parser, free markdown to html converter",
        path: "/tools/markdown-html-converter"
      }}
      icon={FileText}
      title="Markdown ↔ HTML Converter"
      description="Convert between Markdown and HTML with GitHub Flavored Markdown support"
      category="converters"
      actions={
        <>
          <span className="text-xs text-muted-foreground">
            Mode: {mode === 'md-to-html' ? 'Markdown → HTML' : 'HTML → Markdown'}
          </span>
          <Button onClick={handleConvert} size="sm">
            Convert to {mode === 'md-to-html' ? 'HTML' : 'Markdown'}
          </Button>
          <Button onClick={toggleMode} variant="outline" size="sm">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Switch Direction
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >

      <div className="space-y-6">
        {error && (
          <Card className="p-4 border-destructive/50 bg-destructive/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Error</p>
                <p className="text-sm text-destructive/90">{error}</p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Input {mode === 'md-to-html' ? '(Markdown)' : '(HTML)'}
              </label>
              {input && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language={mode === 'md-to-html' ? 'markdown' : 'html'}
              placeholder={mode === 'md-to-html' ? 'Paste Markdown here...' : 'Paste HTML here...'}
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Output {mode === 'md-to-html' ? '(HTML)' : '(Markdown)'}
              </label>
              {output && (
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              )}
            </div>
            <CodeEditor
              value={output}
              language={mode === 'md-to-html' ? 'html' : 'markdown'}
              readOnly
              placeholder={mode === 'md-to-html' ? 'HTML output...' : 'Markdown output...'}
              height="400px"
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">Supported Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Basic Markdown</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Headings (# to ######)</li>
              <li>Bold (**text**) and Italic (*text*)</li>
              <li>Links and Images</li>
              <li>Ordered and Unordered Lists</li>
              <li>Blockquotes</li>
              <li>Code blocks and inline code</li>
              <li>Horizontal rules</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">GitHub Flavored Markdown</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Tables with header rows</li>
              <li>Task lists (checkboxes)</li>
              <li>Strikethrough (~~text~~)</li>
              <li>Autolinked URLs</li>
              <li>Fenced code blocks with language</li>
              <li>Smart typography</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Markdown → HTML</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Clean, semantic HTML output</li>
              <li>Proper heading hierarchy</li>
              <li>Accessible link structure</li>
              <li>Code block formatting</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">HTML → Markdown</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>ATX-style headings (#)</li>
              <li>Fenced code blocks (```)</li>
              <li>Inline link style</li>
              <li>Preserves formatting</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
