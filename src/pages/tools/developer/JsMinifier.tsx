import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { formatJavaScript, minifyJavaScript } from '../../../utils/formatters/code';

export default function JsMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('js-minifier');
  }, [addRecentTool]);

  const handleMinify = () => {
    setOutput(minifyJavaScript(input));
  };

  const handleBeautify = () => {
    setOutput(formatJavaScript(input));
  };

  const loadSample = () => {
    setInput('function greet(name) {\n  // Welcome message\n  console.log("Hello, " + name);\n  return true;\n}');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">JavaScript Minifier</h1>
        <p className="text-muted-foreground">
          Minify and beautify JavaScript code
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
            placeholder="Paste your JavaScript here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Processed JavaScript will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
      />
    </div>
  );
}
