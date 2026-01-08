import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { jsonToTypeScript, defaultOptions } from '../../../utils/converters/typescript';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, FileCode, FileJson, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

export default function JsonToTypeScriptConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [rootName, setRootName] = useState(defaultOptions.rootName);
  const [useInterface, setUseInterface] = useState(defaultOptions.useInterface);
  const [exportTypes, setExportTypes] = useState(defaultOptions.exportTypes);
  const [optionalProperties, setOptionalProperties] = useState(defaultOptions.optionalProperties);
  const [readonlyProperties, setReadonlyProperties] = useState(defaultOptions.readonlyProperties);
  const [addComments, setAddComments] = useState(defaultOptions.addComments);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-typescript-converter');
  }, [addRecentTool]);

  const handleConvert = () => {
    if (!input.trim()) {
      setError('Please enter some JSON to convert');
      setOutput('');
      return;
    }

    try {
      const result = jsonToTypeScript(input, {
        useInterface,
        exportTypes,
        optionalProperties,
        readonlyProperties,
        addComments,
        rootName: rootName || 'Root',
      });
      setOutput(result);
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    const sample = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true,
      roles: ['admin', 'user'],
      address: {
        street: '123 Main St',
        city: 'New York',
        zipCode: '10001',
        country: 'USA',
      },
      orders: [
        {
          orderId: 'ORD-001',
          total: 99.99,
          items: ['item1', 'item2'],
        },
        {
          orderId: 'ORD-002',
          total: 149.50,
          items: ['item3'],
        },
      ],
      metadata: null,
    };
    setInput(JSON.stringify(sample, null, 2));
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
        title: "JSON to TypeScript Converter - Generate TypeScript Interfaces from JSON",
        description: "Convert JSON to TypeScript interfaces and types instantly. Free online tool to generate TypeScript definitions from JSON data with options for interfaces, types, optional properties, readonly modifiers, and JSDoc comments.",
        keywords: "json to typescript, typescript interface generator, json to interface, generate typescript types, json to ts, typescript type generator, convert json to typescript, json typescript converter, typescript interface from json",
        path: "/tools/json-typescript-converter"
      }}
      icon={FileCode}
      title="JSON → TypeScript"
      description="Generate TypeScript interfaces and types from JSON data"
      category="converters"
      actions={
        <div className="flex flex-col gap-2">
          {/* Row 1: Root input and action buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Root:</label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="Root"
                className="h-7 w-24 rounded-md border border-input bg-transparent px-2 text-xs"
              />
            </div>
            <div className="h-4 w-px bg-border" />
            <Button onClick={handleConvert} size="sm">
              <FileCode className="mr-2 h-4 w-4" />
              Generate
            </Button>
            <Button onClick={loadSample} variant="ghost" size="sm">
              <FileJson className="mr-2 h-4 w-4" />
              Load Sample
            </Button>
          </div>

          {/* Row 2: All checkboxes */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={useInterface}
                onChange={(e) => setUseInterface(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input"
              />
              <span className="text-muted-foreground">Interface</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={exportTypes}
                onChange={(e) => setExportTypes(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input"
              />
              <span className="text-muted-foreground">Export</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={optionalProperties}
                onChange={(e) => setOptionalProperties(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input"
              />
              <span className="text-muted-foreground">Optional</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={readonlyProperties}
                onChange={(e) => setReadonlyProperties(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input"
              />
              <span className="text-muted-foreground">Readonly</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={addComments}
                onChange={(e) => setAddComments(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-input"
              />
              <span className="text-muted-foreground">Comments</span>
            </label>
          </div>
        </div>
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
              <label className="text-sm font-medium">Input (JSON)</label>
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
              language="json"
              placeholder="Paste your JSON data here..."
              height="400px"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Output (TypeScript)</label>
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
              language="typescript"
              readOnly
              placeholder="Generated TypeScript will appear here..."
              height="400px"
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">TypeScript Generation Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Type Inference</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Automatic type detection (string, number, boolean, null)</li>
              <li>Nested object support with separate interfaces</li>
              <li>Array type inference with element types</li>
              <li>Mixed array support with union types</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Output Options</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Interface vs Type alias output</li>
              <li>Export keyword toggle</li>
              <li>Optional properties (?) modifier</li>
              <li>Readonly modifier support</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Code Quality</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>PascalCase type naming convention</li>
              <li>Safe property name handling (quotes when needed)</li>
              <li>JSDoc comments generation</li>
              <li>Clean, formatted output</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Edge Cases</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Empty objects and arrays</li>
              <li>Null value handling</li>
              <li>Deep nesting support</li>
              <li>Root array structures</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
