import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
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
    </ToolPageLayout>
  );
}
