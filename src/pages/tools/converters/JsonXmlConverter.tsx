import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { jsonToXml, xmlToJson } from '../../../utils/converters/xml';
import { AlertCircle, ArrowRightLeft, RefreshCw } from 'lucide-react';

export default function JsonXmlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-xml' | 'xml-to-json'>('json-to-xml');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-xml-converter');
  }, [addRecentTool]);

  const handleConvert = () => {
    try {
      if (mode === 'json-to-xml') {
        const result = jsonToXml(input);
        setOutput(result);
      } else {
        const result = xmlToJson(input);
        setOutput(result);
      }
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml');
    setInput(output);
    setOutput(input);
  };

  const loadSample = () => {
    if (mode === 'json-to-xml') {
      setInput('{"root": {"name": "John", "age": 30}}');
    } else {
      setInput('<root><name>John</name><age>30</age></root>');
    }
  };

  return (
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
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">JSON ↔ XML Converter</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert between JSON and XML formats
              </p>
            </div>
          </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={handleConvert} size="sm">
                Convert to {mode === 'json-to-xml' ? 'XML' : 'JSON'}
              </Button>
              <Button onClick={toggleMode} variant="outline" size="sm">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Switch Direction
              </Button>
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

      <InputOutput
        input={
          <Textarea
            placeholder={mode === 'json-to-xml' ? 'Paste JSON here...' : 'Paste XML here...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder={mode === 'json-to-xml' ? 'XML output...' : 'JSON output...'}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />
    </div>
  );
}
