import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { formatCSS, minifyCSS } from '../../../utils/formatters/code';

export default function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('css-minifier');
  }, [addRecentTool]);

  const handleMinify = () => {
    setOutput(minifyCSS(input));
  };

  const handleBeautify = () => {
    setOutput(formatCSS(input));
  };

  const loadSample = () => {
    setInput('.container {\n  display: flex;\n  justify-content: center;\n  /* Comment */\n  padding: 20px;\n}');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">CSS Minifier</h1>
        <p className="text-muted-foreground">
          Minify and beautify CSS code
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleMinify}>Minify</Button>
          <Button onClick={handleBeautify} variant="outline">Beautify</Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </div>
      </Card>

      <InputOutput
        input={
          <Textarea
            placeholder="Paste your CSS here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Processed CSS will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />
    </div>
  );
}
