import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { InputOutput } from '../../../components/shared/InputOutput';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { formatJson, minifyJson, validateJson } from '../../../utils/formatters/json';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, CheckCircle, FileJson } from 'lucide-react';
import { SEO } from '../../../utils/seo';

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
    <>
      <SEO
        title="JSON Formatter - Free Online JSON Beautifier & Validator"
        description="Format, validate, and minify JSON data online with our free JSON formatter tool. Beautify JSON with customizable indentation, validate syntax, and minify for production. Works entirely in your browser - fast, secure, and no data upload required."
        keywords="json formatter, json validator, json beautifier, json minifier, format json online, validate json, json pretty print, json tool, beautify json, minify json, json syntax validator, free json formatter"
        path="/tools/json-formatter"
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
              <FileJson className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">JSON Formatter</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Format, validate, and minify JSON data with customizable indentation
              </p>
            </div>
          </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
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
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
