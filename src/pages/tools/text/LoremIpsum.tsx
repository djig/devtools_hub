import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { generateLoremWords, generateLoremSentences, generateLoremParagraphs } from '../../../utils/text/lorem';

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
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Lorem Ipsum Generator</h1>
        <p className="text-muted-foreground">
          Generate placeholder Lorem Ipsum text for your designs
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Count:</label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <Button onClick={generate}>Generate</Button>
        </div>
      </Card>

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
  );
}
