import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { generateLoremWords, generateLoremSentences, generateLoremParagraphs } from '../../../utils/text/lorem';
import { Type } from 'lucide-react';
import { SEO } from '../../../utils/seo';

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('lorem-ipsum');
    generate();
  }, [addRecentTool]);

  const generate = () => {
    let result = '';
    switch (type) {
      case 'words':
        result = generateLoremWords(count);
        break;
      case 'sentences':
        result = generateLoremSentences(count);
        break;
      case 'paragraphs':
        result = generateLoremParagraphs(count);
        break;
    }
    setOutput(result);
  };

  useEffect(() => {
    generate();
  }, [type, count]);

  return (
    <>
      <SEO
        title="Lorem Ipsum Generator - Free Placeholder Text Generator"
        description="Generate Lorem Ipsum placeholder text online. Free Lorem Ipsum generator for designers and developers. Create paragraphs, words, or bytes of dummy text instantly."
        keywords="lorem ipsum generator, placeholder text, dummy text, lorem ipsum, filler text, lipsum generator, text generator, free generator"
        path="/tools/lorem-ipsum"
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
                <Type className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Lorem Ipsum Generator</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate placeholder Lorem Ipsum text for your designs
                </p>
              </div>
            </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Type:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                >
                  <option value="words">Words</option>
                  <option value="sentences">Sentences</option>
                  <option value="paragraphs">Paragraphs</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Count:</label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-20 h-8 text-xs"
                />
              </div>

              <div className="h-4 w-px bg-border" />

              <Button onClick={generate} size="sm">Generate</Button>
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Generated Text</h3>
          <CopyButton text={output} />
        </div>
        <Textarea
          value={output}
          readOnly
          className="min-h-[300px]"
        />
      </Card>
      </div>
    </>
  );
}
