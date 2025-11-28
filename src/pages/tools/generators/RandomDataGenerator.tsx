import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Shuffle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface RandomData {
  [key: string]: string | number;
}

interface SchemaField {
  id: string;
  name: string;
  type: 'firstName' | 'lastName' | 'fullName' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'zipCode' | 'company' | 'jobTitle' | 'creditCard' | 'ssn' | 'uuid' | 'ipAddress' | 'username' | 'password' | 'birthdate' | 'number' | 'boolean' | 'custom';
  customValue?: string;
  min?: number;
  max?: number;
}

const DEFAULT_SCHEMA: SchemaField[] = [
  { id: '1', name: 'name', type: 'fullName' },
  { id: '2', name: 'email', type: 'email' },
  { id: '3', name: 'phone', type: 'phone' },
  { id: '4', name: 'address', type: 'address' },
  { id: '5', name: 'city', type: 'city' },
  { id: '6', name: 'country', type: 'country' },
  { id: '7', name: 'zipCode', type: 'zipCode' },
  { id: '8', name: 'company', type: 'company' },
  { id: '9', name: 'jobTitle', type: 'jobTitle' },
  { id: '10', name: 'creditCard', type: 'creditCard' },
  { id: '11', name: 'ssn', type: 'ssn' },
  { id: '12', name: 'uuid', type: 'uuid' },
  { id: '13', name: 'ipAddress', type: 'ipAddress' },
  { id: '14', name: 'username', type: 'username' },
  { id: '15', name: 'password', type: 'password' },
  { id: '16', name: 'birthdate', type: 'birthdate' },
];

export default function RandomDataGenerator() {
  const { addRecentTool } = useAppStore();
  const [data, setData] = useState<RandomData | null>(null);
  const [count, setCount] = useState(10);
  const [batchData, setBatchData] = useState<RandomData[]>([]);
  const [schema, setSchema] = useState<SchemaField[]>(DEFAULT_SCHEMA);
  const [schemaText, setSchemaText] = useState(JSON.stringify(DEFAULT_SCHEMA, null, 2));
  const [schemaError, setSchemaError] = useState<string>('');
  const [useCustomSchema, setUseCustomSchema] = useState(false);
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

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
    'Denver', 'Boston', 'Portland', 'Nashville', 'Miami', 'Atlanta'
  ];

  const streets = [
    'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Park Pl', 'Washington Blvd',
    'Lake View Dr', 'Hill Rd', 'Elm St', 'Pine Ave', 'River Rd', 'Sunset Blvd',
    'Broadway', 'First Ave', 'Second St', 'Madison Ave', 'Market St', 'Church St'
  ];

  const companies = [
    'Tech Solutions Inc', 'Global Industries', 'Digital Innovations', 'Metro Systems',
    'Prime Enterprises', 'Apex Corporation', 'Vista Technologies', 'Summit Group',
    'Horizon LLC', 'Quantum Labs', 'Nexus Partners', 'Fusion Dynamics'
  ];

  const jobTitles = [
    'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer',
    'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Financial Analyst',
    'Operations Manager', 'Business Consultant', 'Project Manager', 'Account Executive'
  ];

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = <T,>(arr: T[]) => arr[random(0, arr.length - 1)];

  const generateFieldValue = (field: SchemaField): string | number => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    switch (field.type) {
      case 'firstName':
        return firstName;
      case 'lastName':
        return lastName;
      case 'fullName':
        return `${firstName} ${lastName}`;
      case 'email':
        return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random(1, 999)}@example.com`;
      case 'phone':
        return `+1 (${random(200, 999)}) ${random(100, 999)}-${random(1000, 9999)}`;
      case 'address':
        return `${random(100, 9999)} ${randomItem(streets)}`;
      case 'city':
        return randomItem(cities);
      case 'country':
        return 'United States';
      case 'zipCode':
        return String(random(10000, 99999));
      case 'company':
        return randomItem(companies);
      case 'jobTitle':
        return randomItem(jobTitles);
      case 'creditCard':
        return Array.from({ length: 16 }, () => random(0, 9)).join('').match(/.{1,4}/g)?.join(' ') || '';
      case 'ssn':
        return `${random(100, 999)}-${random(10, 99)}-${random(1000, 9999)}`;
      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      case 'ipAddress':
        return `${random(1, 255)}.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`;
      case 'username':
        return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random(1, 999)}`;
      case 'password':
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        return Array.from({ length: 12 }, () => chars[random(0, chars.length - 1)]).join('');
      case 'birthdate':
        const year = random(1950, 2005);
        const month = random(1, 12);
        const day = random(1, 28);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      case 'number':
        return random(field.min || 0, field.max || 1000);
      case 'boolean':
        return Math.random() > 0.5 ? 'true' : 'false';
      case 'custom':
        return field.customValue || 'N/A';
      default:
        return 'N/A';
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

  const handleSchemaChange = (value: string) => {
    setSchemaText(value);

    try {
      const parsed = JSON.parse(value);

      // Validate schema structure
      if (!Array.isArray(parsed)) {
        setSchemaError('Schema must be an array of field definitions');
        return;
      }

      // Validate each field
      for (const field of parsed) {
        if (!field.name || typeof field.name !== 'string') {
          setSchemaError('Each field must have a "name" property (string)');
          return;
        }
        if (!field.type || typeof field.type !== 'string') {
          setSchemaError('Each field must have a "type" property (string)');
          return;
        }
      }

      // Valid schema
      setSchema(parsed);
      setSchemaError('');
      toast.success('Schema Valid', { description: 'Schema parsed successfully' });
    } catch (e) {
      setSchemaError('Invalid JSON syntax');
    }
  };

  const loadDefaultSchema = () => {
    const defaultJson = JSON.stringify(DEFAULT_SCHEMA, null, 2);
    setSchemaText(defaultJson);
    setSchema(DEFAULT_SCHEMA);
    setSchemaError('');
    toast.success('Schema Loaded', { description: 'Default schema has been loaded' });
  };

  const formatSchema = () => {
    try {
      const parsed = JSON.parse(schemaText);
      const formatted = JSON.stringify(parsed, null, 2);
      setSchemaText(formatted);
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

      {/* Schema Toggle */}
      <Card className="p-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useCustomSchema}
            onChange={(e) => setUseCustomSchema(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm font-medium">Use Custom Schema</span>
        </label>
      </Card>

      {/* Schema Editor */}
      {useCustomSchema && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Define Schema (JSON)</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Edit the JSON schema below. Each field must have "name" and "type" properties.
              </p>
            </div>
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
            value={schemaText}
            onChange={(e) => handleSchemaChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder="Enter JSON schema..."
          />

          {schemaError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>{schemaError}</span>
            </div>
          )}

          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Available field types:</p>
            <p>firstName, lastName, fullName, email, phone, address, city, country, zipCode, company, jobTitle, creditCard, ssn, uuid, ipAddress, username, password, birthdate, number, boolean, custom</p>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Example schema:</p>
            <code className="block p-2 rounded bg-muted text-xs">
              {`[
  { "id": "1", "name": "fullName", "type": "fullName" },
  { "id": "2", "name": "email", "type": "email" },
  { "id": "3", "name": "age", "type": "number", "min": 18, "max": 65 }
]`}
            </code>
          </div>
        </Card>
      )}

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
          {count > 5000 && (
            <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Large batch - may take time</span>
            </div>
          )}
          {(data || batchData.length > 0) && (
            <>
              <div className="flex-1" />
              <Button
                variant="ghost"
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
                variant="ghost"
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
            {Object.entries(data).map(([key, value]) => (
              <DataRow key={key} label={key} value={String(value)} />
            ))}
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
                    {Object.values(item).map((value, vidx) => (
                      <td key={vidx} className="py-2 px-2 font-mono text-xs">
                        {String(value)}
                      </td>
                    ))}
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
          <p>• Define custom schemas with multiple field types</p>
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
