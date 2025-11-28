import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Shuffle, AlertTriangle, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface RandomData {
  [key: string]: string | number;
}

interface SchemaField {
  name: string;
  type: string | SchemaObject | SchemaArray;
}

interface SchemaObject {
  type: 'object';
  properties: Record<string, SchemaField>;
}

interface SchemaArray {
  type: 'array';
  items: SchemaField;
  length?: number;
}

const DEFAULT_SCHEMA: SchemaField[] = [
  { name: 'id', type: 'number' },
  { name: 'name', type: 'string' },
  { name: 'email', type: 'string' },
  { name: 'age', type: 'number' },
  { name: 'isActive', type: 'boolean' },
  {
    name: 'address',
    type: {
      type: 'object',
      properties: {
        street: { name: 'street', type: 'string' },
        city: { name: 'city', type: 'string' },
        zipCode: { name: 'zipCode', type: 'string' }
      }
    }
  },
  {
    name: 'tags',
    type: {
      type: 'array',
      items: { name: 'tag', type: 'string' },
      length: 3
    }
  }
];

export default function RandomDataGenerator() {
  const { addRecentTool } = useAppStore();
  const [data, setData] = useState<RandomData | null>(null);
  const [count, setCount] = useState(10);
  const [batchData, setBatchData] = useState<RandomData[]>([]);
  const [schema, setSchema] = useState<SchemaField[]>(DEFAULT_SCHEMA);
  const [schemaText, setSchemaText] = useState(JSON.stringify(DEFAULT_SCHEMA, null, 2));
  const [tempSchemaText, setTempSchemaText] = useState(JSON.stringify(DEFAULT_SCHEMA, null, 2));
  const [schemaError, setSchemaError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    addRecentTool('random-data-generator');
  }, [addRecentTool]);

  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
  ];

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = <T,>(arr: T[]) => arr[random(0, arr.length - 1)];

  const generateFieldValue = (field: SchemaField): any => {
    const fieldType = field.type;

    // Handle object types
    if (typeof fieldType === 'object' && 'type' in fieldType) {
      if (fieldType.type === 'object') {
        const obj: Record<string, any> = {};
        Object.entries(fieldType.properties).forEach(([key, propField]) => {
          obj[key] = generateFieldValue(propField);
        });
        return obj;
      }

      if (fieldType.type === 'array') {
        const length = fieldType.length || random(2, 5);
        return Array.from({ length }, () => generateFieldValue(fieldType.items));
      }
    }

    // Handle primitive types
    const typeStr = typeof fieldType === 'string' ? fieldType : 'string';
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    switch (typeStr.toLowerCase()) {
      case 'string':
        return `${firstName} ${lastName}`;
      case 'number':
        return random(1, 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'email':
        return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random(1, 999)}@example.com`;
      case 'phone':
        return `+1 (${random(200, 999)}) ${random(100, 999)}-${random(1000, 9999)}`;
      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      case 'date':
        const year = random(2020, 2024);
        const month = random(1, 12);
        const day = random(1, 28);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      case 'url':
        return `https://example.com/${firstName.toLowerCase()}`;
      case 'ipaddress':
      case 'ip':
        return `${random(1, 255)}.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`;
      default:
        return `Sample ${typeStr}`;
    }
  };

  const generateRandomData = (): RandomData => {
    const data: RandomData = {};
    schema.forEach(field => {
      data[field.name] = generateFieldValue(field);
    });
    return data;
  };

  const calculateDataSize = (data: RandomData[]): number => {
    return new Blob([JSON.stringify(data)]).size;
  };

  const handleGenerate = () => {
    setData(generateRandomData());
    setBatchData([]);
  };

  const handleGenerateBatch = async () => {
    const actualCount = Math.min(count, 100000); // Allow up to 100k records

    // Show warning for large batches
    if (actualCount > 5000) {
      toast.warning('Large Dataset Warning', {
        description: `Generating ${actualCount.toLocaleString()} records. This may take a moment...`,
      });
    }

    setGenerating(true);
    setData(null);

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const batch: RandomData[] = [];
        const batchSize = 1000;

        for (let i = 0; i < actualCount; i += batchSize) {
          const remaining = Math.min(batchSize, actualCount - i);
          for (let j = 0; j < remaining; j++) {
            batch.push(generateRandomData());
          }
        }

        const dataSize = calculateDataSize(batch);
        const dataSizeMB = dataSize / (1024 * 1024);

        setBatchData(batch);

        if (dataSizeMB > 2) {
          toast.error('Large Data Size Warning', {
            description: `Generated data is ${dataSizeMB.toFixed(2)} MB. Export may be slow. Consider reducing the record count.`,
            duration: 5000,
          });
        } else {
          toast.success('Data Generated Successfully', {
            description: `Generated ${actualCount.toLocaleString()} records (${dataSizeMB.toFixed(2)} MB)`,
          });
        }
      } catch (error) {
        toast.error('Generation Failed', {
          description: 'Failed to generate data. Please try with fewer records.',
        });
        setBatchData([]);
      } finally {
        setGenerating(false);
      }
    }, 100);
  };

  const exportAsJSON = () => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    return JSON.stringify(exportData, null, 2);
  };

  const exportAsCSV = () => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    if (exportData.length === 0) return '';

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(item =>
      Object.values(item).map(val => `"${val}"`).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const validateSchemaField = (field: any, path: string = ''): string | null => {
    if (!field.name || typeof field.name !== 'string') {
      return `Field at ${path} must have a "name" property (string)`;
    }
    if (!field.type) {
      return `Field "${field.name}" must have a "type" property`;
    }

    const fieldType = field.type;

    // Handle primitive types
    if (typeof fieldType === 'string') {
      return null;
    }

    // Handle object types
    if (typeof fieldType === 'object') {
      if (fieldType.type === 'object') {
        if (!fieldType.properties || typeof fieldType.properties !== 'object') {
          return `Object field "${field.name}" must have "properties" object`;
        }
        // Validate nested properties
        for (const [key, prop] of Object.entries(fieldType.properties)) {
          const error = validateSchemaField(prop as any, `${field.name}.${key}`);
          if (error) return error;
        }
        return null;
      }

      if (fieldType.type === 'array') {
        if (!fieldType.items) {
          return `Array field "${field.name}" must have "items" property`;
        }
        const error = validateSchemaField(fieldType.items, `${field.name}[]`);
        if (error) return error;
        return null;
      }

      return `Field "${field.name}" has invalid type structure`;
    }

    return `Field "${field.name}" type must be a string or object`;
  };

  const openSchemaModal = () => {
    setTempSchemaText(schemaText);
    setSchemaError('');
    setIsModalOpen(true);
  };

  const handleSchemaChange = (value: string) => {
    setTempSchemaText(value);

    try {
      const parsed = JSON.parse(value);

      // Validate schema structure
      if (!Array.isArray(parsed)) {
        setSchemaError('Schema must be an array of field definitions');
        return;
      }

      // Validate each field
      for (const field of parsed) {
        const error = validateSchemaField(field);
        if (error) {
          setSchemaError(error);
          return;
        }
      }

      // Valid schema
      setSchemaError('');
    } catch (e) {
      setSchemaError('Invalid JSON syntax');
    }
  };

  const saveSchema = () => {
    if (schemaError) {
      toast.error('Invalid Schema', { description: schemaError });
      return;
    }

    try {
      const parsed = JSON.parse(tempSchemaText);
      setSchema(parsed);
      setSchemaText(tempSchemaText);
      setIsModalOpen(false);
      toast.success('Schema Saved', { description: 'Schema updated successfully' });
    } catch (e) {
      toast.error('Invalid JSON', { description: 'Cannot save invalid JSON' });
    }
  };

  const loadDefaultSchema = () => {
    const defaultJson = JSON.stringify(DEFAULT_SCHEMA, null, 2);
    setTempSchemaText(defaultJson);
    setSchemaError('');
  };

  const formatSchema = () => {
    try {
      const parsed = JSON.parse(tempSchemaText);
      const formatted = JSON.stringify(parsed, null, 2);
      setTempSchemaText(formatted);
      toast.success('Formatted', { description: 'Schema JSON formatted' });
    } catch (e) {
      toast.error('Invalid JSON', { description: 'Cannot format invalid JSON' });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Random Data Generator</h1>
        <p className="text-muted-foreground">
          Generate realistic fake data with custom schemas for testing and development
        </p>
      </div>

      {/* Schema Button */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Data Schema</h3>
            <p className="text-xs text-muted-foreground">
              {schema.length} fields defined
            </p>
          </div>
          <Button onClick={openSchemaModal} variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Edit Schema
          </Button>
        </div>
      </Card>

      {/* Schema Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Data Schema"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Define your custom schema in JSON format. Each field must have "name" and "type" properties.
            </p>
            <div className="flex gap-2">
              <Button onClick={loadDefaultSchema} variant="outline" size="sm">
                Load Default
              </Button>
              <Button onClick={formatSchema} variant="outline" size="sm">
                Format
              </Button>
            </div>
          </div>

          <Textarea
            value={tempSchemaText}
            onChange={(e) => handleSchemaChange(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
            placeholder="Enter JSON schema..."
          />

          {schemaError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{schemaError}</span>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Primitive types:</p>
            <p>string, number, boolean, email, phone, uuid, date, url, ip</p>
          </div>

          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Example schemas:</p>
            <div className="space-y-2">
              <div>
                <p className="text-xs mb-1">Simple fields:</p>
                <code className="block p-2 rounded bg-muted text-xs whitespace-pre">
                  {`[
  { "name": "id", "type": "number" },
  { "name": "name", "type": "string" },
  { "name": "email", "type": "email" },
  { "name": "isActive", "type": "boolean" }
]`}
                </code>
              </div>
              <div>
                <p className="text-xs mb-1">With nested object:</p>
                <code className="block p-2 rounded bg-muted text-xs whitespace-pre">
                  {`[
  { "name": "id", "type": "number" },
  {
    "name": "address",
    "type": {
      "type": "object",
      "properties": {
        "street": { "name": "street", "type": "string" },
        "city": { "name": "city", "type": "string" }
      }
    }
  }
]`}
                </code>
              </div>
              <div>
                <p className="text-xs mb-1">With array:</p>
                <code className="block p-2 rounded bg-muted text-xs whitespace-pre">
                  {`[
  { "name": "id", "type": "number" },
  {
    "name": "tags",
    "type": {
      "type": "array",
      "items": { "name": "tag", "type": "string" },
      "length": 3
    }
  }
]`}
                </code>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button onClick={() => setIsModalOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={saveSchema} disabled={!!schemaError}>
              Save Schema
            </Button>
          </div>
        </div>
      </Modal>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button onClick={handleGenerate} className="gap-2" disabled={generating || schema.length === 0}>
            <Shuffle className="h-4 w-4" />
            Generate Single
          </Button>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="1"
              max="100000"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100000, parseInt(e.target.value) || 1)))}
              className="w-28 text-sm"
              disabled={generating}
            />
            <Button onClick={handleGenerateBatch} variant="outline" disabled={generating || schema.length === 0}>
              {generating ? 'Generating...' : `Generate ${count.toLocaleString()}`}
            </Button>
          </div>
          {(data || batchData.length > 0) && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportAsJSON()], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'random-data.json';
                  a.click();
                  toast.success('Exported', { description: 'Data exported as JSON' });
                }}
              >
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportAsCSV()], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'random-data.csv';
                  a.click();
                  toast.success('Exported', { description: 'Data exported as CSV' });
                }}
              >
                Export CSV
              </Button>
            </>
          )}
          {count > 5000 && (
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Large batch - may take time</span>
            </div>
          )}
        </div>
      </Card>

      {/* Single Record Display */}
      {data && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Generated Record</h3>
            <CopyButton text={JSON.stringify(data, null, 2)} />
          </div>
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => {
              const displayValue = typeof value === 'object'
                ? JSON.stringify(value, null, 2)
                : String(value);
              return <DataRow key={key} label={key} value={displayValue} />;
            })}
          </div>
        </Card>
      )}

      {/* Batch Display */}
      {batchData.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Generated {batchData.length.toLocaleString()} Records
              {' '}({(calculateDataSize(batchData) / (1024 * 1024)).toFixed(2)} MB)
            </h3>
            <CopyButton text={exportAsJSON()} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(batchData[0]).map((key) => (
                    <th key={key} className="text-left py-2 px-2 font-medium">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batchData.slice(0, 100).map((item, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    {Object.values(item).map((value, vidx) => {
                      const displayValue = typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value);
                      return (
                        <td
                          key={vidx}
                          className="py-2 px-2 font-mono text-xs max-w-xs"
                          title={displayValue}
                        >
                          <div className="truncate">
                            {displayValue}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {batchData.length > 100 && (
              <p className="text-center py-3 text-sm text-muted-foreground">
                Showing first 100 of {batchData.length.toLocaleString()} records. Export to see all data.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Random Data Generator</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• All generated data is completely fake and randomly created</p>
          <p>• Define custom schemas using JSON with primitive types (string, number, boolean, etc.)</p>
          <p>• Support for nested objects and arrays in schema definition</p>
          <p>• Generate up to 100,000 records at once</p>
          <p>• Warning displayed for batches over 5,000 records or 2MB of data</p>
          <p>• Export data as JSON or CSV for easy integration</p>
          <p>• Table preview shows first 100 records for large batches</p>
        </div>
      </Card>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}:</span>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono">{value}</code>
        <CopyButton text={value} />
      </div>
    </div>
  );
}
