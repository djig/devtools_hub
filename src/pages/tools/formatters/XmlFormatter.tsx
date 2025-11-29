import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { formatXml } from '../../../utils/converters/xml';
import { AlertCircle, FileCode } from 'lucide-react';
import { SEO } from '../../../utils/seo';

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
    <>
      <SEO
        title="XML Formatter - Free Online XML Beautifier & Validator"
        description="Format and validate XML documents online with our free XML formatter. Beautify XML with proper indentation and structure. Works in your browser - secure, fast, and no data upload required."
        keywords="xml formatter, xml validator, xml beautifier, format xml online, validate xml, xml pretty print, xml tool, beautify xml, xml syntax validator, free xml formatter"
        path="/tools/xml-formatter"
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
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">XML Formatter</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Format and validate XML documents with proper indentation
              </p>
            </div>
          </div>

            {/* Action Buttons (TOP-RIGHT) */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button onClick={handleFormat} size="sm">Format XML</Button>
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
      </div>
    </>
  );
}
