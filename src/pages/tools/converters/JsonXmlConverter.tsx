import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { jsonToXml, xmlToJson } from '../../../utils/converters/xml';
import { AlertCircle, ArrowRightLeft, RefreshCw, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

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
    } catch {
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
        title: "JSON to XML Converter - Free Online JSON XML Converter",
        description: "Convert between JSON and XML formats instantly with our free online converter. Bidirectional conversion tool that transforms JSON to XML and XML to JSON. Works entirely in your browser - fast and secure.",
        keywords: "json to xml, xml to json, json xml converter, convert json to xml, convert xml to json, online converter, free converter",
        path: "/tools/json-xml-converter"
      }}
      icon={RefreshCw}
      title="JSON ↔ XML Converter"
      description="Convert between JSON and XML formats"
      category="converters"
      actions={
        <>
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
                Input {mode === 'json-to-xml' ? '(JSON)' : '(XML)'}
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
              language={mode === 'json-to-xml' ? 'json' : 'xml'}
              placeholder={mode === 'json-to-xml' ? 'Paste JSON here...' : 'Paste XML here...'}
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Output {mode === 'json-to-xml' ? '(XML)' : '(JSON)'}
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
              language={mode === 'json-to-xml' ? 'xml' : 'json'}
              readOnly
              placeholder={mode === 'json-to-xml' ? 'XML output...' : 'JSON output...'}
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
