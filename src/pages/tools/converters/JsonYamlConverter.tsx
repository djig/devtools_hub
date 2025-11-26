import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { jsonToYaml, yamlToJson } from '../../../utils/converters/yaml';
import { AlertCircle } from 'lucide-react';
import { ArrowRightLeft } from 'lucide-react';

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
    } catch (err) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">JSON ↔ YAML Converter</h1>
        <p className="text-muted-foreground">
          Convert between JSON and YAML formats
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleConvert}>
            Convert to {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
          </Button>
          <Button onClick={toggleMode} variant="outline">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Switch Direction
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
          <span className="text-sm text-muted-foreground">
            Mode: {mode === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
          </span>
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

      <InputOutput
        input={
          <Textarea
            placeholder={mode === 'json-to-yaml' ? 'Paste JSON here...' : 'Paste YAML here...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder={mode === 'json-to-yaml' ? 'YAML output...' : 'JSON output...'}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />
    </div>
  );
}
