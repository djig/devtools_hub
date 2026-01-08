import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { jsonToCsv, csvToJson } from '../../../utils/converters/csv';
import { AlertCircle, ArrowRightLeft, RefreshCw, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-csv-converter');
  }, [addRecentTool]);

  const handleConvert = () => {
    try {
      if (mode === 'json-to-csv') {
        const result = jsonToCsv(input);
        setOutput(result);
      } else {
        const result = csvToJson(input);
        setOutput(result);
      }
      setError('');
    } catch {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv');
    setInput(output);
    setOutput(input);
  };

  const loadSample = () => {
    if (mode === 'json-to-csv') {
      setInput('[{"name":"John","age":30,"city":"New York"},{"name":"Jane","age":25,"city":"Boston"}]');
    } else {
      setInput('name,age,city\nJohn,30,New York\nJane,25,Boston');
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
        title: "JSON to CSV Converter - Free Online JSON CSV Converter",
        description: "Convert between JSON and CSV formats instantly with our free online converter. Transform JSON arrays to CSV spreadsheets and CSV data to JSON. Perfect for data import/export. Works entirely in your browser.",
        keywords: "json to csv, csv to json, json csv converter, convert json to csv, convert csv to json, json to excel, csv converter, free json to CSV converter, free csv converter, json to csv online, csv to json online",
        path: "/tools/json-csv-converter"
      }}
      icon={RefreshCw}
      title="JSON ↔ CSV Converter"
      description="Convert between JSON and CSV formats"
      category="converters"
      actions={
        <>
          <Button onClick={handleConvert} size="sm">
            Convert to {mode === 'json-to-csv' ? 'CSV' : 'JSON'}
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
                Input {mode === 'json-to-csv' ? '(JSON)' : '(CSV)'}
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
              language={mode === 'json-to-csv' ? 'json' : 'plaintext'}
              placeholder={mode === 'json-to-csv' ? 'Paste JSON array here...' : 'Paste CSV here...'}
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Output {mode === 'json-to-csv' ? '(CSV)' : '(JSON)'}
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
              language={mode === 'json-to-csv' ? 'plaintext' : 'json'}
              readOnly
              placeholder={mode === 'json-to-csv' ? 'CSV output...' : 'JSON output...'}
              height="400px"
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
