import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { formatJson, minifyJson, validateJson } from '../../../utils/formatters/json';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, CheckCircle, FileJson } from 'lucide-react';

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
    <ToolPageLayout
      seo={{
        title: "JSON Formatter - Free Online JSON Beautifier & Validator",
        description: "Format, validate, and minify JSON data online with our free JSON formatter tool. Beautify JSON with customizable indentation, validate syntax, and minify for production. Works entirely in your browser - fast, secure, and no data upload required.",
        keywords: "json formatter, json validator, json beautifier, json minifier, format json online, validate json, json pretty print, json tool, beautify json, minify json, json syntax validator, free json formatter",
        path: "/tools/json-formatter"
      }}
      icon={FileJson}
      title="JSON Formatter"
      description="Format, validate, and minify JSON data with customizable indentation"
      actions={
        <>
          <Button onClick={handleFormat} size="sm">Format</Button>
          <Button onClick={handleMinify} variant="outline" size="sm">
            Minify
          </Button>
          <Button onClick={handleValidate} variant="outline" size="sm">
            Validate
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Spaces:</label>
            <select
              value={spaces}
              onChange={(e) => setSpaces(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>
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

        {output && !error && output.startsWith('✓') && (
          <Card className="p-4 border-green-500/50 bg-green-500/10">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-semibold text-green-600 dark:text-green-400">{output}</p>
            </div>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input JSON</label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="json"
              placeholder="Paste your JSON here..."
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            <CodeEditor
              value={output}
              language="json"
              readOnly
              placeholder="Formatted JSON will appear here..."
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
