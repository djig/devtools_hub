import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { generateLoremWords, generateLoremSentences, generateLoremParagraphs } from '../../../utils/text/lorem';
import { Type } from 'lucide-react';

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
    <ToolPageLayout
      seo={{
        title: "Lorem Ipsum Generator - Free Placeholder Text Generator",
        description: "Generate Lorem Ipsum placeholder text online. Free Lorem Ipsum generator for designers and developers. Create paragraphs, words, or bytes of dummy text instantly.",
        keywords: "lorem ipsum generator, placeholder text, dummy text, lorem ipsum, filler text, lipsum generator, text generator, free generator",
        path: "/tools/lorem-ipsum"
      }}
      icon={Type}
      title="Lorem Ipsum Generator"
      description="Generate placeholder Lorem Ipsum text for your designs"
      actions={
        <>
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
        </>
      }
    >
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
    </ToolPageLayout>
  );
}
