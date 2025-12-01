import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { encodeHtml, decodeHtml } from '../../../utils/converters/html';
import { Code2 } from 'lucide-react';

export default function HtmlEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('html-encoder');
  }, [addRecentTool]);

  const handleAction = () => {
    if (mode === 'encode') {
      setOutput(encodeHtml(input));
    } else {
      setOutput(decodeHtml(input));
    }
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('<div class="container">Hello & Welcome!</div>');
    } else {
      setInput('&lt;div class=&quot;container&quot;&gt;Hello &amp; Welcome!&lt;/div&gt;');
    }
  };

  return (
    <ToolPageLayout
      seo={{
        title: "HTML Entity Encoder/Decoder - Free Online HTML Escape Tool",
        description: "Encode and decode HTML entities and special characters online. Free HTML encoder that converts characters to HTML entities and decodes HTML entities back to text. Secure and fast.",
        keywords: "html encoder, html decoder, html entity encoder, html escape, encode html, decode html entities, html special characters, free html encoder",
        path: "/tools/html-encoder"
      }}
      icon={Code2}
      title="HTML Entity Encoder"
      description="Encode and decode HTML entities and special characters"
      category="encoders"
      actions={
        <>
          <Button onClick={handleAction} size="sm">
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </Button>
          <Button onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')} variant="outline" size="sm">
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="html"
            placeholder={mode === 'encode' ? 'Enter HTML to encode...' : 'Enter HTML entities to decode...'}
            height="400px"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Output</label>
          <CodeEditor
            value={output}
            language="html"
            readOnly
            placeholder={mode === 'encode' ? 'Encoded HTML entities...' : 'Decoded HTML...'}
            height="400px"
          />
        </div>
      </div>

      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">Common HTML Entities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
          <div>&lt; = &amp;lt;</div>
          <div>&gt; = &amp;gt;</div>
          <div>&amp; = &amp;amp;</div>
          <div>&quot; = &amp;quot;</div>
          <div>&#39; = &amp;#39;</div>
          <div>/ = &amp;#x2F;</div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
