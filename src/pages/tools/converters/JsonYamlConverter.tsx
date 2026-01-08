import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { jsonToYaml, yamlToJson } from '../../../utils/converters/yaml';
import { AlertCircle, ArrowRightLeft, RefreshCw, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonYamlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-yaml-converter');
  }, [addRecentTool]);

  const handleConvert = () => {
    try {
      if (mode === 'json-to-yaml') {
        const result = jsonToYaml(input);
        setOutput(result);
      } else {
        const result = yamlToJson(input);
        setOutput(result);
      }
      setError('');
    } catch {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    setInput(output);
    setOutput(input);
  };

  const loadSample = () => {
    if (mode === 'json-to-yaml') {
      setInput('{"name": "John Doe", "age": 30, "city": "New York"}');
    } else {
      setInput('name: John Doe\nage: 30\ncity: New York');
    }
  };

  const handleCopy = async () => {
    if (!output) {
      toast.error('No output to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "JSON to YAML Converter - Free Online JSON YAML Converter",
        description: "Convert between JSON and YAML formats instantly with our free online converter. Bidirectional conversion tool that transforms JSON to YAML and YAML to JSON. Works entirely in your browser - fast and secure.",
        keywords: "json to yaml, yaml to json, json yaml converter, convert json to yaml, convert yaml to json, online json yml converter, online yaml to json converter, free online JSON to YAML converter, json yaml tool, json yaml translator, json yaml format converter",
        path: "/tools/json-yaml-converter"
      }}
      icon={RefreshCw}
      title="JSON ↔ YAML Converter"
      description="Convert between JSON and YAML formats"
      category="converters"
      actions={
        <>
          <span className="text-xs text-muted-foreground">
            Mode: {mode === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
          </span>
          <Button onClick={handleConvert} size="sm">
            Convert to {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
          </Button>
          <Button onClick={toggleMode} variant="outline" size="sm">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Switch Direction
          </Button>
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Input {mode === 'json-to-yaml' ? '(JSON)' : '(YAML)'}
              </label>
              {input && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>
            <CodeEditor
              value={input}
              onChange={setInput}
              language={mode === 'json-to-yaml' ? 'json' : 'yaml'}
              placeholder={mode === 'json-to-yaml' ? 'Paste JSON here...' : 'Paste YAML here...'}
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Output {mode === 'json-to-yaml' ? '(YAML)' : '(JSON)'}
              </label>
              {output && (
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1.5"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
              )}
            </div>
            <CodeEditor
              value={output}
              language={mode === 'json-to-yaml' ? 'yaml' : 'json'}
              readOnly
              placeholder={mode === 'json-to-yaml' ? 'YAML output...' : 'JSON output...'}
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
