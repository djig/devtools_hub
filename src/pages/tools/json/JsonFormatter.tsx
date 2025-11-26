import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { InputOutput } from '../../../components/shared/InputOutput';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { formatJson, minifyJson, validateJson } from '../../../utils/formatters/json';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [spaces, setSpaces] = useState(2);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-formatter');
  }, [addRecentTool]);

  const handleFormat = () => {
    try {
      const formatted = formatJson(input, spaces);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleMinify = () => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const handleValidate = () => {
    const result = validateJson(input);
    if (result.valid) {
      setError('');
      setOutput('✓ Valid JSON');
    } else {
      setError(result.error || 'Invalid JSON');
      setOutput('');
    }
  };

  const loadSample = () => {
    const sample = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
      hobbies: ['reading', 'coding', 'gaming'],
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and minify JSON data with customizable indentation
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleFormat}>Format</Button>
          <Button onClick={handleMinify} variant="outline">
            Minify
          </Button>
          <Button onClick={handleValidate} variant="outline">
            Validate
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-muted-foreground">Spaces:</label>
            <select
              value={spaces}
              onChange={(e) => setSpaces(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>
      </Card>

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

      {output && !error && output.startsWith('✓') && (
        <Card className="p-4 border-green-500/50 bg-green-500/10">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="font-semibold text-green-600 dark:text-green-400">{output}</p>
          </div>
        </Card>
      )}

      <InputOutput
        input={
          <Textarea
            placeholder="Paste your JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output && !output.startsWith('✓')}
      />
    </div>
  );
}
