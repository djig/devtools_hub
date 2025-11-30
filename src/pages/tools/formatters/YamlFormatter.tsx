import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { formatYaml } from '../../../utils/converters/yaml';
import { AlertCircle, FileCode } from 'lucide-react';

export default function YamlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('yaml-formatter');
  }, [addRecentTool]);

  const handleFormat = () => {
    try {
      const formatted = formatYaml(input);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    setInput('name: John Doe\nage: 30\ncity: New York\nhobbies:\n  - reading\n  - coding');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "YAML Formatter - Free Online YAML Beautifier & Validator",
        description: "Format and validate YAML files online with our free YAML formatter. Beautify YAML with proper indentation, validate syntax, and ensure structure correctness. Works entirely in your browser - fast and secure.",
        keywords: "yaml formatter, yaml validator, yaml beautifier, format yaml online, validate yaml, yml formatter, yaml tool, beautify yaml, yaml syntax validator, free yaml formatter",
        path: "/tools/yaml-formatter"
      }}
      icon={FileCode}
      title="YAML Formatter"
      description="Format and validate YAML files with proper indentation"
      actions={
        <>
          <Button onClick={handleFormat} size="sm">Format YAML</Button>
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
            <label className="text-sm font-medium">Input YAML</label>
            <CodeEditor
              value={input}
              onChange={setInput}
              language="yaml"
              placeholder="Paste your YAML here..."
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Output</label>
            <CodeEditor
              value={output}
              language="yaml"
              readOnly
              placeholder="Formatted YAML will appear here..."
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
