import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { encodeHtml, decodeHtml } from '../../../utils/converters/html';
import { Code2 } from 'lucide-react';
import { SEO } from '../../../utils/seo';

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
    <>
      <SEO
        title="HTML Entity Encoder/Decoder - Free Online HTML Escape Tool"
        description="Encode and decode HTML entities and special characters online. Free HTML encoder that converts characters to HTML entities and decodes HTML entities back to text. Secure and fast."
        keywords="html encoder, html decoder, html entity encoder, html escape, encode html, decode html entities, html special characters, free html encoder"
        path="/tools/html-encoder"
      />
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
                <Code2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">HTML Entity Encoder</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Encode and decode HTML entities and special characters
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={handleAction} size="sm">
                {mode === 'encode' ? 'Encode' : 'Decode'}
              </Button>
              <Button onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')} variant="outline" size="sm">
                Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
              </Button>
              <Button onClick={loadSample} variant="ghost" size="sm">
                Load Sample
              </Button>
            </div>
          </div>
        </div>
      </div>

      <InputOutput
        input={
          <Textarea
            placeholder={mode === 'encode' ? 'Enter HTML to encode...' : 'Enter HTML entities to decode...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder={mode === 'encode' ? 'Encoded HTML entities...' : 'Decoded HTML...'}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />

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
      </div>
    </>
  );
}
