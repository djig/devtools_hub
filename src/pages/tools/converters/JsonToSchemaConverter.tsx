import { useState, useEffect } from 'react';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import { InputOutput } from '../../../components/shared/InputOutput';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, FileJson, Shield, Box } from 'lucide-react';

export default function JsonToSchemaConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [includeRequired, setIncludeRequired] = useState(true);
  const [includeDescriptions, setIncludeDescriptions] = useState(false);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-to-schema-converter');
  }, [addRecentTool]);

  const inferType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'number';
    }
    return typeof value;
  };

  const generateSchema = (data: any, includeRequired: boolean, includeDescriptions: boolean): any => {
    const type = inferType(data);
    const schema: any = { type };

    // Handle null
    if (type === 'null') {
      return schema;
    }

    // Handle arrays
    if (type === 'array') {
      if (data.length > 0) {
        // Analyze all items to get the most complete schema
        const itemSchemas = data.map((item: any) =>
          generateSchema(item, includeRequired, includeDescriptions)
        );

        // For simplicity, use the first item's schema
        // In a more advanced version, we could merge schemas
        schema.items = itemSchemas[0];

        // Add array constraints
        if (includeDescriptions) {
          schema.description = `Array with ${data.length} item${data.length !== 1 ? 's' : ''}`;
        }
      } else {
        schema.items = {};
        if (includeDescriptions) {
          schema.description = 'Empty array';
        }
      }
      return schema;
    }

    // Handle objects
    if (type === 'object') {
      schema.properties = {};
      const requiredProps: string[] = [];

      for (const [key, value] of Object.entries(data)) {
        schema.properties[key] = generateSchema(value, includeRequired, includeDescriptions);

        // Mark all existing properties as required
        if (includeRequired && value !== null && value !== undefined) {
          requiredProps.push(key);
        }
      }

      if (includeRequired && requiredProps.length > 0) {
        schema.required = requiredProps;
      }

      // Typically don't allow additional properties in generated schemas
      schema.additionalProperties = false;

      if (includeDescriptions) {
        schema.description = `Object with ${Object.keys(data).length} propert${Object.keys(data).length !== 1 ? 'ies' : 'y'}`;
      }

      return schema;
    }

    // Handle strings
    if (type === 'string') {
      const value = data as string;

      // Add constraints based on the actual value
      if (value.length > 0) {
        schema.minLength = 1;
      }

      // Detect common patterns
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        schema.format = 'email';
        schema.pattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
        if (includeDescriptions) {
          schema.description = 'Email address';
        }
      } else if (/^https?:\/\/.+/.test(value)) {
        schema.format = 'uri';
        if (includeDescriptions) {
          schema.description = 'URL';
        }
      } else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        schema.format = 'date-time';
        if (includeDescriptions) {
          schema.description = 'Date/time string';
        }
      } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        schema.format = 'uuid';
        if (includeDescriptions) {
          schema.description = 'UUID';
        }
      }

      return schema;
    }

    // Handle numbers
    if (type === 'number' || type === 'integer') {
      if (includeDescriptions) {
        schema.description = type === 'integer' ? 'Integer value' : 'Numeric value';
      }
      return schema;
    }

    // Handle booleans
    if (type === 'boolean') {
      if (includeDescriptions) {
        schema.description = 'Boolean value';
      }
      return schema;
    }

    return schema;
  };

  const handleConvert = () => {
    try {
      const parsed = JSON.parse(input);
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...generateSchema(parsed, includeRequired, includeDescriptions),
      };
      setOutput(JSON.stringify(schema, null, 2));
      setError('');
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  };

  const loadSample = () => {
    const sample = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      isActive: true,
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
        country: 'USA',
      },
      hobbies: ['reading', 'coding', 'gaming'],
      scores: [95, 87, 92],
      metadata: {
        createdAt: '2024-01-01T00:00:00Z',
        userId: '550e8400-e29b-41d4-a716-446655440000',
      },
    };
    setInput(JSON.stringify(sample, null, 2));
  };

  return (
    <ToolPageLayout
      seo={{
        title: "JSON to Schema Generator - Free Online JSON Schema Creator",
        description: "Generate JSON Schema from JSON data automatically. Free online JSON Schema generator that creates Draft-07 schemas with type detection, pattern recognition, and validation rules. Perfect for API documentation and validation.",
        keywords: "json to schema, json schema generator, generate json schema, json schema creator, json schema from json, api schema, schema generator, free tool",
        path: "/tools/json-to-schema-converter"
      }}
      icon={Box}
      title="JSON → Schema Converter"
      description="Generate JSON Schema definitions from JSON data automatically"
      category="converters"
      actions={
        <>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={includeRequired}
              onChange={(e) => setIncludeRequired(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-input"
            />
            <span className="text-muted-foreground">Include Required</span>
          </label>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={includeDescriptions}
              onChange={(e) => setIncludeDescriptions(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-input"
            />
            <span className="text-muted-foreground">Add Descriptions</span>
          </label>

          <div className="h-4 w-px bg-border" />

          <Button onClick={handleConvert} size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Generate Schema
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            <FileJson className="mr-2 h-4 w-4" />
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
            placeholder="Paste your JSON data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        }
        output={
          <Textarea
            value={output}
            readOnly
            placeholder="Generated JSON Schema will appear here..."
            className="min-h-[400px] font-mono text-sm"
          />
        }
        outputValue={output}
        showCopy={!error && !!output}
      />

      {/* Info Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">Schema Generation Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Type Detection</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Automatic type inference (string, number, integer, boolean, array, object, null)</li>
              <li>Nested object and array support</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Pattern Recognition</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Email format detection</li>
              <li>URL/URI format detection</li>
              <li>Date-time format detection</li>
              <li>UUID format detection</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Constraints</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>String minLength constraints</li>
              <li>Required properties (optional)</li>
              <li>additionalProperties: false for objects</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Standards</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>JSON Schema Draft-07 format</li>
              <li>Proper $schema declaration</li>
              <li>Clean, formatted output</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
