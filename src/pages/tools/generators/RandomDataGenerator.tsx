import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Shuffle, AlertTriangle, Settings, FileJson, FileSpreadsheet, Save, X, Upload, Download, Archive, Trash2, Info, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import JSZip from 'jszip';

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
  const [dataSize, setDataSize] = useState<string>('0 B');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [, setGenerationProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [, setExportProgress] = useState(0);
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [pendingExport, setPendingExport] = useState<'json' | 'csv' | 'zip' | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    addRecentTool('random-data-generator');

    // Detect if running on mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || (isSmallScreen && isTouchDevice));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    addRecentTool('random-data-generator');

    // Cleanup on unmount
    return () => {
      // Clear large data from memory when component unmounts
      setBatchData([]);
      setData(null);

      // Force garbage collection hint (if supported)
      if (typeof window !== 'undefined' && 'gc' in window) {
        try {
          (window as any).gc();
        } catch (e) {
          // gc() not available in this environment
        }
      }
    };
  }, [addRecentTool]);

  // Cleanup helper function
  const performCleanup = (clearData: boolean = false) => {
    if (clearData) {
      setBatchData([]);
      setData(null);
      setDataSize('0 B');
    }

    // Reset progress states
    setGenerationProgress(0);
    setExportProgress(0);

    // Suggest garbage collection
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc();
      } catch (e) {
        // gc() not available
      }
    }
  };

  // Manual cleanup handler for user-initiated data clearing
  const handleClearData = () => {
    const currentDataSize = batchData.length > 0
      ? calculateDataSize(batchData) / (1024 * 1024)
      : 0;

    performCleanup(true);

    toast.success('Data Cleared', {
      description: currentDataSize > 0
        ? `Cleared ${currentDataSize.toFixed(2)} MB of data from memory`
        : 'All generated data has been cleared',
    });
  };

  // Handle info modal
  const handleOpenInfo = () => {
    setShowDisclaimer(true);
  };

  const handleCloseInfo = () => {
    setShowDisclaimer(false);
  };

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

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleGenerate = () => {
    const newData = generateRandomData();
    setData(newData);
    setBatchData([]);
    const size = new Blob([JSON.stringify(newData)]).size;
    setDataSize(formatBytes(size));
  };

  const handleGenerateBatch = async () => {
    // Mobile devices: limit to 10,000 records
    if (isMobile && count > 10000) {
      toast.error('Mobile Limit Exceeded', {
        description: 'Mobile devices are limited to 10,000 records. Please reduce the count.',
        duration: 5000,
      });
      return;
    }

    // Desktop: Show confirmation for very large batches
    if (count > 100000) {
      setPendingCount(count);
      setShowConfirmDialog(true);
      return;
    }

    await generateBatchData(count);
  };

  const handleConfirmGeneration = async () => {
    setShowConfirmDialog(false);
    await generateBatchData(pendingCount);
  };

  const handleCancelGeneration = () => {
    setShowConfirmDialog(false);
    setPendingCount(0);
  };

  const generateBatchData = async (actualCount: number) => {
    // Mobile: Don't use Web Workers, always use main thread with lower limits
    if (isMobile) {
      if (actualCount > 5000) {
        toast.warning('Large Dataset Warning', {
          description: `Generating ${actualCount.toLocaleString()} records on mobile. This may take time...`,
        });
      }
      setGenerating(true);
      setData(null);
      setGenerationProgress(0);
      generateInMainThread(actualCount);
      return;
    }

    // Desktop: Show warning for large batches
    if (actualCount > 5000) {
      toast.warning('Large Dataset Warning', {
        description: `Generating ${actualCount.toLocaleString()} records. This may take a moment...`,
      });
    }

    setGenerating(true);
    setData(null);
    setGenerationProgress(0);

    // Desktop: Use Web Worker for large batches (>10,000 records)
    if (actualCount > 10000) {
      try {
        const worker = new Worker('/dataGenerator.worker.js');

        worker.onmessage = (e) => {
          const { type, data: workerData, progress, generated, error } = e.data;

          if (type === 'progress') {
            setGenerationProgress(progress);
            toast.loading(`Generating... ${progress}% (${generated.toLocaleString()} records)`, {
              id: 'generation-progress'
            });
          } else if (type === 'complete') {
            const dataSize = calculateDataSize(workerData);
            const dataSizeMB = dataSize / (1024 * 1024);

            setBatchData(workerData);
            setDataSize(formatBytes(dataSize));
            setGenerating(false);
            setGenerationProgress(0);

            toast.dismiss('generation-progress');

            if (dataSizeMB > 5) {
              toast.warning('Large Data Size', {
                description: `Generated ${dataSizeMB.toFixed(2)} MB of data. Recommend using ZIP export for compression.`,
                duration: 5000,
              });
            } else if (dataSizeMB > 2) {
              toast.warning('Large Data Size Warning', {
                description: `Generated data is ${dataSizeMB.toFixed(2)} MB. Export may be slow. Consider using ZIP export.`,
                duration: 5000,
              });
            } else {
              toast.success('Data Generated Successfully', {
                description: `Generated ${actualCount.toLocaleString()} records (${dataSizeMB.toFixed(2)} MB)`,
              });
            }

            // Cleanup: terminate worker and clear progress
            worker.terminate();
            performCleanup(false);

            // For very large datasets, suggest cleanup
            if (dataSizeMB > 50) {
              setTimeout(() => {
                toast.info('Memory Tip', {
                  description: 'Consider clearing data after export to free up memory.',
                  duration: 7000,
                });
              }, 2000);
            }
          } else if (type === 'error') {
            toast.dismiss('generation-progress');
            toast.error('Generation Failed', {
              description: error || 'Failed to generate data. Please try with fewer records.',
            });
            setBatchData([]);
            setGenerating(false);
            setGenerationProgress(0);
            worker.terminate();

            // Cleanup after error
            performCleanup(false);
          }
        };

        worker.onerror = () => {
          toast.dismiss('generation-progress');
          toast.error('Worker Error', {
            description: 'Failed to start worker. Falling back to main thread.',
          });
          setGenerating(false);
          setGenerationProgress(0);
          worker.terminate();

          // Cleanup after error
          performCleanup(false);
        };

        worker.postMessage({
          schema,
          count: actualCount,
          batchSize: 1000
        });
      } catch (error) {
        toast.error('Worker Error', {
          description: 'Web Worker not supported. Generating in main thread...',
        });
        // Fallback to main thread
        generateInMainThread(actualCount);
      }
    } else {
      // Use main thread for smaller batches
      generateInMainThread(actualCount);
    }
  };

  const generateInMainThread = (actualCount: number) => {
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
        setDataSize(formatBytes(dataSize));

        if (dataSizeMB > 5) {
          toast.warning('Large Data Size', {
            description: `Generated ${dataSizeMB.toFixed(2)} MB of data. Recommend using ZIP export for compression.`,
            duration: 5000,
          });
        } else if (dataSizeMB > 2) {
          toast.warning('Large Data Size Warning', {
            description: `Generated data is ${dataSizeMB.toFixed(2)} MB. Export may be slow. Consider using ZIP export.`,
            duration: 5000,
          });
        } else {
          toast.success('Data Generated Successfully', {
            description: `Generated ${actualCount.toLocaleString()} records (${dataSizeMB.toFixed(2)} MB)`,
          });
        }

        // Cleanup after successful generation
        performCleanup(false);

        // For very large datasets, suggest cleanup
        if (dataSizeMB > 50) {
          setTimeout(() => {
            toast.info('Memory Tip', {
              description: 'Consider clearing data after export to free up memory.',
              duration: 7000,
            });
          }, 2000);
        }
      } catch (error) {
        toast.error('Generation Failed', {
          description: 'Failed to generate data. Please try with fewer records.',
        });
        setBatchData([]);

        // Cleanup after error
        performCleanup(false);
      } finally {
        setGenerating(false);
        setGenerationProgress(0);
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

  const handleImportSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json')) {
      toast.error('Invalid File', { description: 'Please select a JSON file' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Validate schema structure
        if (!Array.isArray(parsed)) {
          toast.error('Invalid Schema', { description: 'Schema must be an array of field definitions' });
          return;
        }

        // Validate each field
        for (const field of parsed) {
          const error = validateSchemaField(field);
          if (error) {
            toast.error('Invalid Schema', { description: error });
            return;
          }
        }

        // Valid schema - update textarea
        const formatted = JSON.stringify(parsed, null, 2);
        setTempSchemaText(formatted);
        setSchemaError('');
        toast.success('Schema Imported', { description: `Imported schema with ${parsed.length} fields` });
      } catch (err) {
        toast.error('Import Failed', { description: 'Invalid JSON file format' });
      }
    };

    reader.onerror = () => {
      toast.error('Import Failed', { description: 'Failed to read file' });
    };

    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const handleExportSchema = () => {
    try {
      const parsed = JSON.parse(tempSchemaText);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'schema.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Schema Exported', { description: 'Schema saved as schema.json' });
    } catch (e) {
      toast.error('Export Failed', { description: 'Invalid JSON cannot be exported' });
    }
  };

  const handleExportClick = (format: 'json' | 'csv' | 'zip') => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    const dataSize = new Blob([JSON.stringify(exportData)]).size;
    const dataSizeMB = dataSize / (1024 * 1024);

    // Mobile: Block exports over 5MB
    if (isMobile && dataSizeMB > 5) {
      toast.error('Mobile Export Limit', {
        description: `Export size (${dataSizeMB.toFixed(2)} MB) exceeds mobile limit of 5MB. Please generate fewer records.`,
        duration: 7000,
      });
      return;
    }

    // Desktop: Show warning for large exports (> 10MB)
    if (dataSizeMB > 10) {
      setPendingExport(format);
      setShowExportWarning(true);
    } else {
      performExport(format);
    }
  };

  const handleConfirmExport = () => {
    setShowExportWarning(false);
    if (pendingExport) {
      performExport(pendingExport);
      setPendingExport(null);
    }
  };

  const handleCancelExport = () => {
    setShowExportWarning(false);
    setPendingExport(null);
  };

  const performExport = async (format: 'json' | 'csv' | 'zip') => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    const dataSize = new Blob([JSON.stringify(exportData)]).size;
    const dataSizeMB = dataSize / (1024 * 1024);

    // Mobile: Always use main thread (no Web Workers)
    if (isMobile) {
      exportInMainThread(format);
      return;
    }

    // Desktop: Use Web Worker for large exports (> 5MB)
    if (dataSizeMB > 5 && format !== 'json') {
      try {
        setExporting(true);
        setExportProgress(0);

        const worker = new Worker('/dataExporter.worker.js');

        worker.onmessage = async (e) => {
          const { type, format: exportFormat, data: exportedData, originalSize, compressedSize, progress, error } = e.data;

          if (type === 'progress') {
            setExportProgress(progress);
            toast.loading(`Exporting ${format.toUpperCase()}... ${Math.round(progress)}%`, {
              id: 'export-progress'
            });
          } else if (type === 'complete') {
            toast.dismiss('export-progress');

            let blob: Blob;
            let filename: string;

            if (exportFormat === 'json') {
              blob = new Blob([exportedData], { type: 'application/json' });
              filename = 'random-data.json';
            } else if (exportFormat === 'csv') {
              blob = new Blob([exportedData], { type: 'text/csv' });
              filename = 'random-data.csv';
            } else if (exportFormat === 'zip') {
              blob = new Blob([exportedData], { type: 'application/zip' });
              filename = 'random-data.zip';
              const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
              toast.success('Exported as ZIP', {
                description: `Compressed ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${compressionRatio}% reduction)`
              });
            } else {
              blob = new Blob([exportedData]);
              filename = 'random-data.txt';
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();

            // Cleanup: Revoke object URL immediately to free memory
            URL.revokeObjectURL(url);

            if (exportFormat !== 'zip') {
              toast.success('Exported', { description: `Data exported as ${exportFormat.toUpperCase()}` });
            }

            setExporting(false);
            setExportProgress(0);

            // Cleanup: terminate worker and clear progress
            worker.terminate();
            performCleanup(false);

            // Suggest data cleanup for very large exports
            const currentDataSize = batchData.length > 0
              ? calculateDataSize(batchData) / (1024 * 1024)
              : 0;
            if (currentDataSize > 50) {
              setTimeout(() => {
                toast.info('Memory Tip', {
                  description: 'Export complete! You can now clear the data to free up memory if needed.',
                  duration: 7000,
                });
              }, 1000);
            }
          } else if (type === 'error') {
            toast.dismiss('export-progress');
            toast.error('Export Failed', { description: error || 'Failed to export data' });
            setExporting(false);
            setExportProgress(0);

            // Cleanup: terminate worker
            worker.terminate();
            performCleanup(false);
          }
        };

        worker.onerror = () => {
          toast.dismiss('export-progress');
          toast.error('Worker Error', { description: 'Export failed. Falling back to main thread.' });
          setExporting(false);
          setExportProgress(0);
          worker.terminate();

          // Cleanup after error
          performCleanup(false);

          // Fallback to main thread
          exportInMainThread(format);
        };

        worker.postMessage({
          type: format,
          data: exportData,
          schemaText
        });
      } catch (error) {
        toast.error('Worker Error', { description: 'Web Worker not supported. Exporting in main thread...' });
        exportInMainThread(format);
      }
    } else {
      // Export in main thread for smaller files or JSON
      exportInMainThread(format);
    }
  };

  const exportInMainThread = (format: 'json' | 'csv' | 'zip') => {
    if (format === 'json') {
      const blob = new Blob([exportAsJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'random-data.json';
      a.click();

      // Cleanup: Revoke object URL immediately
      URL.revokeObjectURL(url);
      toast.success('Exported', { description: 'Data exported as JSON' });

      // Cleanup progress states
      performCleanup(false);
    } else if (format === 'csv') {
      const blob = new Blob([exportAsCSV()], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'random-data.csv';
      a.click();

      // Cleanup: Revoke object URL immediately
      URL.revokeObjectURL(url);
      toast.success('Exported', { description: 'Data exported as CSV' });

      // Cleanup progress states
      performCleanup(false);
    } else if (format === 'zip') {
      handleExportZipMainThread();
    }
  };

  const handleExportZipMainThread = async () => {
    try {
      const zip = new JSZip();
      const jsonData = exportAsJSON();
      const csvData = exportAsCSV();

      // Add files to zip
      zip.file('data.json', jsonData);
      zip.file('data.csv', csvData);
      zip.file('schema.json', schemaText);

      // Generate zip file
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      // Calculate compression ratio
      const originalSize = new Blob([jsonData]).size;
      const compressedSize = blob.size;
      const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'random-data.zip';
      a.click();

      // Cleanup: Revoke object URL immediately
      URL.revokeObjectURL(url);

      toast.success('Exported as ZIP', {
        description: `Compressed ${formatBytes(originalSize)} → ${formatBytes(compressedSize)} (${compressionRatio}% reduction)`
      });

      // Cleanup progress states
      performCleanup(false);

      // Suggest data cleanup for large exports
      const dataSizeMB = originalSize / (1024 * 1024);
      if (dataSizeMB > 50) {
        setTimeout(() => {
          toast.info('Memory Tip', {
            description: 'Export complete! You can now clear the data to free up memory if needed.',
            duration: 7000,
          });
        }, 1000);
      }
    } catch (e) {
      toast.error('Export Failed', { description: 'Failed to create ZIP file' });

      // Cleanup after error
      performCleanup(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Random Data Generator</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={handleOpenInfo}
            title="About this tool"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
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
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsModalOpen(false)} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={saveSchema} disabled={!!schemaError} className="gap-2">
              <Save className="h-4 w-4" />
              Save Schema
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Define your custom schema in JSON format. Each field must have "name" and "type" properties.
            </p>
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportSchema}
                className="hidden"
                id="schema-import-input"
              />
              <Button
                onClick={() => document.getElementById('schema-import-input')?.click()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Upload className="h-3 w-3" />
                Import
              </Button>
              <Button
                onClick={handleExportSchema}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="h-3 w-3" />
                Export
              </Button>
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
        </div>
      </Modal>

      {/* Confirmation Dialog for Large Batches */}
      <Modal
        isOpen={showConfirmDialog}
        onClose={handleCancelGeneration}
        title="Large Dataset Warning"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancelGeneration} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleConfirmGeneration} variant="default" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Continue Anyway
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-orange-900 dark:text-orange-100">
                You are about to generate {pendingCount.toLocaleString()} records
              </p>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Generating this many records may:
              </p>
              <ul className="text-sm text-orange-800 dark:text-orange-200 list-disc list-inside space-y-1 ml-2">
                <li>Take several minutes to complete</li>
                <li>Consume significant memory on your device</li>
                <li>Cause your browser to freeze or become unresponsive</li>
                <li>Fail completely depending on your hardware capabilities</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Close unnecessary browser tabs to free up memory</li>
              <li>Consider generating smaller batches (10,000 - 50,000 records)</li>
              <li>Use a device with sufficient RAM (8GB+ recommended)</li>
              <li>Save your work before proceeding</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Performance depends on your client machine's hardware specifications. The application may fail if your system runs out of memory.
          </p>
        </div>
      </Modal>

      {/* Export Warning Dialog */}
      <Modal
        isOpen={showExportWarning}
        onClose={handleCancelExport}
        title="Large Export Warning"
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancelExport} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleConfirmExport} variant="default" className="gap-2">
              <Download className="h-4 w-4" />
              Export Anyway
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                You are about to export a large dataset
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Exporting large datasets (over 10MB) may:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1 ml-2">
                <li>Take a significant amount of time to process</li>
                <li>Cause your browser to become temporarily unresponsive</li>
                <li>Consume considerable memory during the export process</li>
                <li>Result in a very large file that may be difficult to open</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Recommendations:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use ZIP export for better compression and smaller file size</li>
              <li>Close unnecessary applications to free up system memory</li>
              <li>Consider exporting in smaller batches if possible</li>
              <li>Ensure you have sufficient disk space for the export file</li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground italic">
            The export will be processed using a Web Worker to minimize impact on browser responsiveness.
          </p>
        </div>
      </Modal>

      {/* Tool Information Modal */}
      <Modal
        isOpen={showDisclaimer}
        onClose={handleCloseInfo}
        title="About Random Data Generator"
        size="xl"
        footer={
          <div className="flex justify-end">
            <Button onClick={handleCloseInfo} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Got It
            </Button>
          </div>
        }
      >
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Important Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Client-Side Development Tool
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This is a <strong>lightweight, browser-based tool</strong> designed for quick prototyping,
                testing, and development. All data generation happens locally in your browser with
                <strong> no data sent to any server</strong>.
              </p>
            </div>
          </div>

          {/* Best Use Cases */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              Perfect For
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span><strong>Quick prototyping</strong> - Generate mock data instantly for UI development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span><strong>Learning & demos</strong> - Test your code with realistic fake data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span><strong>Privacy-first</strong> - Everything runs locally, no data leaves your browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span><strong>Custom schemas</strong> - Define nested objects and arrays with JSON</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span><strong>Small to medium datasets</strong> - Up to {isMobile ? '10,000' : '100,000'} records</span>
              </li>
            </ul>
          </div>

          {/* Limitations */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Not Suitable For
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">✗</span>
                <span><strong>Production data quality</strong> - Limited name pool, no realistic distributions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">✗</span>
                <span><strong>Relational data</strong> - No foreign keys or referential integrity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">✗</span>
                <span><strong>Large-scale testing</strong> - Browser memory limits apply (max ~100MB datasets)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">✗</span>
                <span><strong>ML training data</strong> - No statistical distributions or field correlations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">✗</span>
                <span><strong>Enterprise features</strong> - No team collaboration, version control, or API access</span>
              </li>
            </ul>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="font-semibold mb-3">Key Strengths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Zero cost</strong> - No API limits or paid tiers</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Instant access</strong> - No authentication required</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Offline capable</strong> - Works without internet</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Multiple formats</strong> - Export as JSON, CSV, or ZIP</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Progressive enhancement</strong> - Web Workers for large datasets</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Mobile support</strong> - Adaptive limits for devices</span>
              </div>
            </div>
          </div>

          {/* Device Limits */}
          {isMobile && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Mobile Device Limits
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Mobile devices have reduced limits for optimal performance:
                </p>
                <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1 ml-2">
                  <li>Maximum 10,000 records per generation</li>
                  <li>Maximum 5MB export size</li>
                  <li>Web Workers disabled for compatibility</li>
                </ul>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div>
            <h3 className="font-semibold mb-3">Technical Implementation</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Architecture:</strong> Pure client-side application built with React and TypeScript.
                All processing happens in your browser using Web Workers for parallelization on large datasets.
              </p>
              <p>
                <strong>Data Generation:</strong> Uses a small pool of 32 first names and 32 last names for string
                generation. Numbers are uniformly distributed random values. Nested objects and arrays are fully supported.
              </p>
              <p>
                <strong>Performance:</strong> Desktop browsers can generate up to 100,000 records with Web Worker
                support. Mobile devices are limited to 10,000 records due to memory constraints.
              </p>
              <p>
                <strong>Export Formats:</strong> JSON (pretty-printed), CSV (with nested object flattening),
                and ZIP (containing JSON, CSV, and schema files with DEFLATE compression level 9).
              </p>
              <p>
                <strong>Memory Management:</strong> Automatic cleanup after operations, manual "Clear Data" button,
                and garbage collection hints for optimal browser performance.
              </p>
            </div>
          </div>

          {/* Use Cases & Alternatives */}
          <div>
            <h3 className="font-semibold mb-3">When to Use Alternatives</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>For Production-Quality Data:</strong> Consider <a href="https://github.com/faker-js/faker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Faker.js</a> (Node.js)
                or <a href="https://www.mockaroo.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mockaroo</a> with extensive data type libraries,
                realistic distributions, and locale support.
              </p>
              <p>
                <strong>For Relational Data:</strong> Use database-specific tools or ORMs that support fixtures
                with foreign key relationships, referential integrity, and cascading operations.
              </p>
              <p>
                <strong>For ML/Data Science:</strong> Use <a href="https://numpy.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NumPy</a>/<a href="https://pandas.pydata.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Pandas</a> for
                custom distributions (normal, Poisson, exponential) with controlled correlations and statistical properties.
              </p>
              <p>
                <strong>For Enterprise/Team Use:</strong> Consider commercial tools with collaboration features,
                API access, version control, audit trails, and support contracts.
              </p>
            </div>
          </div>

          {/* Disclaimer & Fine Print */}
          <div className="text-xs text-muted-foreground border-t pt-4 space-y-3">
            <div>
              <p className="font-medium mb-2">⚠️ Important Notice</p>
              <p>
                This tool generates <strong>completely fake, random data</strong> for development and testing purposes only.
                The data is NOT suitable for production use, compliance testing, or scenarios requiring realistic data distributions.
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">Data Quality Limitations</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Names repeat from a limited pool (64 total combinations)</li>
                <li>No locale-specific formatting (dates, phone numbers, addresses)</li>
                <li>Uniform random distribution only (no normal, skewed, or custom distributions)</li>
                <li>No field correlations (e.g., age doesn't correlate with income)</li>
                <li>No data validation rules (email domains, phone formats, zip codes)</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2">Browser & Hardware Limitations</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Maximum dataset size depends on available RAM (typically ~100MB)</li>
                <li>Large operations may temporarily freeze the browser UI</li>
                <li>Web Workers not supported in some older browsers or private/incognito modes</li>
                <li>Mobile devices have reduced limits due to memory constraints</li>
                <li>No streaming - entire dataset must fit in memory</li>
              </ul>
            </div>

            <div>
              <p className="font-medium mb-2">Privacy & Security</p>
              <p>
                This is a free, open-source tool with <strong>no data collection, no analytics, and no server communication</strong>.
                All processing happens locally in your browser. Your schemas and generated data never leave your device.
                No cookies are used except localStorage for UI preferences.
              </p>
            </div>

            <div>
              <p className="font-medium mb-2">License & Attribution</p>
              <p>
                This tool is provided "as-is" without warranties of any kind. Use at your own risk.
                Not responsible for data quality issues, browser crashes, or lost data.
                For critical use cases, always verify generated data meets your requirements.
              </p>
            </div>

            <div className="text-center pt-2 border-t">
              <p className="italic">
                Version 1.0 • Built with React, TypeScript, and Web Workers • Client-Side Only
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Mobile Warning Banner */}
      {isMobile && (
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Mobile Device Detected</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                To ensure optimal performance on mobile devices:
              </p>
              <ul className="text-sm text-amber-800 dark:text-amber-200 list-disc list-inside space-y-1 ml-2">
                <li>Maximum 10,000 records per generation</li>
                <li>Maximum 5MB export size</li>
                <li>Web Workers disabled (not supported on all mobile browsers)</li>
              </ul>
            </div>
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
              max={isMobile ? 10000 : undefined}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-28 text-sm"
              disabled={generating}
            />
            <Button onClick={handleGenerateBatch} variant="outline" disabled={generating || schema.length === 0}>
              {generating ? 'Generating...' : `Generate ${count.toLocaleString()}`}
            </Button>
          </div>
          {(data || batchData.length > 0) && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-md text-sm font-medium">
                <span>Size: {dataSize}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleExportClick('json')}
                disabled={exporting}
              >
                <FileJson className="h-4 w-4" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleExportClick('csv')}
                disabled={exporting}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleExportClick('zip')}
                disabled={exporting}
              >
                <Archive className="h-4 w-4" />
                Export ZIP
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={handleClearData}
                disabled={exporting || generating}
              >
                <Trash2 className="h-4 w-4" />
                Clear Data
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
          <p>• Import and export custom schemas as JSON files</p>
          {isMobile ? (
            <>
              <p>• <strong>Mobile:</strong> Maximum 10,000 records per generation</p>
              <p>• <strong>Mobile:</strong> Maximum 5MB export size</p>
              <p>• <strong>Mobile:</strong> Web Workers disabled for compatibility</p>
            </>
          ) : (
            <>
              <p>• Generate any number of records (confirmation required for &gt;100,000)</p>
              <p>• Web Workers used for generating &gt;10,000 records with progress tracking</p>
              <p>• Web Workers used for exporting datasets &gt;5MB to prevent browser freezing</p>
              <p>• Export warning dialog shown for datasets &gt;10MB</p>
            </>
          )}
          <p>• Large batch generation depends on your device's hardware capabilities</p>
          <p>• Warning displayed for batches over 5,000 records or 2MB of data</p>
          <p>• Export data as JSON, CSV, or compressed ZIP archive</p>
          <p>• ZIP export includes JSON, CSV, and schema files with DEFLATE compression</p>
          <p>• Recommended to use ZIP export for datasets larger than 5MB</p>
          <p>• Table preview shows first 100 records for large batches</p>
          <p>• "Clear Data" button available to manually free up memory after operations</p>
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
