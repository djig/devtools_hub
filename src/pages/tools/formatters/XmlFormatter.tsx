import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { InputOutput } from '../../../components/shared/InputOutput';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { formatXml } from '../../../utils/converters/xml';
import { AlertCircle, FileCode } from 'lucide-react';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('xml-formatter');
  }, [addRecentTool]);

  const handleFormat = () => {
    try {
      const formatted = formatXml(input);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    setInput('<root><name>John</name><age>30</age><city>New York</city></root>');
  };

  return (
    <ToolPageLayout
      seo={{
        title: "XML Formatter - Free Online XML Beautifier & Validator",
        description: "Format and validate XML documents online with our free XML formatter. Beautify XML with proper indentation and structure. Works in your browser - secure, fast, and no data upload required.",
        keywords: "xml formatter, xml validator, xml beautifier, format xml online, validate xml, xml pretty print, xml tool, beautify xml, xml syntax validator, free xml formatter",
        path: "/tools/xml-formatter"
      }}
      icon={FileCode}
      title="XML Formatter"
      description="Format and validate XML documents with proper indentation"
      actions={
        <>
          <Button onClick={handleFormat} size="sm">Format XML</Button>
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
            placeholder="Paste your XML here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted XML will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />
    </ToolPageLayout>
  );
}
