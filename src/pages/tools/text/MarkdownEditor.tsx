import { useState, useEffect, useMemo } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import MarkdownIt from 'markdown-it';
import { FileText } from 'lucide-react';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('markdown-editor');
  }, [addRecentTool]);

  const html = useMemo(() => {
    try {
      return md.render(markdown);
    } catch (error) {
      return '<p class="text-red-500">Error rendering markdown</p>';
    }
  }, [markdown]);

  const loadSample = () => {
    setMarkdown(`# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2
  - Nested item

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

\`inline code\`

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

> Blockquote text

---

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`);
  };

  return (
    <div className="space-y-6">
      {/* Compact Hero Section with Breadcrumb & Actions */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-sm">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative">
          {/* Breadcrumb Navigation */}
        <div className="px-6 pt-4 pb-2">
          <Breadcrumb />
        </div>

        {/* Single Row: Title, Icon & Action Buttons */}
          <div className="flex items-center justify-between gap-4 px-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Markdown Editor</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Edit and preview Markdown with live rendering
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={loadSample} variant="ghost" size="sm">
                Load Sample
              </Button>
              <CopyButton text={markdown} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Markdown Input
          </h3>
          <Textarea
            placeholder="Enter your markdown here..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="min-h-[500px] font-mono text-sm"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Preview
          </h3>
          <div
            className="prose prose-sm dark:prose-invert max-w-none min-h-[500px] p-4 rounded border border-border bg-muted/30"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>
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
    </div>
  );
}
