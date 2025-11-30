import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { ToolPageLayout } from '../../../components/layouts/ToolPageLayout';
import useAppStore from '../../../store/useAppStore';
import { AlertCircle, CheckCircle, Shield, FileJson } from 'lucide-react';

interface ValidationError {
  path: string;
  message: string;
}

export default function JsonSchemaValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [schemaInput, setSchemaInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: ValidationError[];
  } | null>(null);
  const { addRecentTool } = useAppStore();

  useEffect(() => {
    addRecentTool('json-schema-validator');
  }, [addRecentTool]);

  const validateJsonSchema = (json: any, schema: any, path = 'root'): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Type validation
    if (schema.type) {
      const actualType = Array.isArray(json) ? 'array' : typeof json;
      const expectedType = schema.type;

      if (actualType === 'object' && json === null) {
        if (expectedType !== 'null') {
          errors.push({
            path,
            message: `Expected type "${expectedType}" but got "null"`,
          });
        }
        return errors;
      }

      if (actualType !== expectedType) {
        errors.push({
          path,
          message: `Expected type "${expectedType}" but got "${actualType}"`,
        });
        return errors;
      }
    }

    // Required properties validation
    if (schema.required && schema.type === 'object') {
      for (const requiredProp of schema.required) {
        if (!(requiredProp in json)) {
          errors.push({
            path,
            message: `Missing required property "${requiredProp}"`,
          });
        }
      }
    }

    // Properties validation
    if (schema.properties && schema.type === 'object') {
      for (const [key, value] of Object.entries(json)) {
        if (schema.properties[key]) {
          const propErrors = validateJsonSchema(
            value,
            schema.properties[key],
            `${path}.${key}`
          );
          errors.push(...propErrors);
        } else if (schema.additionalProperties === false) {
          errors.push({
            path: `${path}.${key}`,
            message: `Additional property "${key}" is not allowed`,
          });
        }
      }
    }

    // Array validation
    if (schema.type === 'array') {
      if (schema.items) {
        json.forEach((item: any, index: number) => {
          const itemErrors = validateJsonSchema(
            item,
            schema.items,
            `${path}[${index}]`
          );
          errors.push(...itemErrors);
        });
      }

      if (schema.minItems !== undefined && json.length < schema.minItems) {
        errors.push({
          path,
          message: `Array must have at least ${schema.minItems} items, but has ${json.length}`,
        });
      }

      if (schema.maxItems !== undefined && json.length > schema.maxItems) {
        errors.push({
          path,
          message: `Array must have at most ${schema.maxItems} items, but has ${json.length}`,
        });
      }
    }

    // String validation
    if (schema.type === 'string') {
      if (schema.minLength !== undefined && json.length < schema.minLength) {
        errors.push({
          path,
          message: `String must be at least ${schema.minLength} characters long`,
        });
      }

      if (schema.maxLength !== undefined && json.length > schema.maxLength) {
        errors.push({
          path,
          message: `String must be at most ${schema.maxLength} characters long`,
        });
      }

      if (schema.pattern) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(json)) {
          errors.push({
            path,
            message: `String does not match pattern "${schema.pattern}"`,
          });
        }
      }

      if (schema.enum && !schema.enum.includes(json)) {
        errors.push({
          path,
          message: `Value must be one of: ${schema.enum.join(', ')}`,
        });
      }
    }

    // Number validation
    if (schema.type === 'number' || schema.type === 'integer') {
      if (schema.type === 'integer' && !Number.isInteger(json)) {
        errors.push({
          path,
          message: 'Value must be an integer',
        });
      }

      if (schema.minimum !== undefined && json < schema.minimum) {
        errors.push({
          path,
          message: `Value must be >= ${schema.minimum}`,
        });
      }

      if (schema.maximum !== undefined && json > schema.maximum) {
        errors.push({
          path,
          message: `Value must be <= ${schema.maximum}`,
        });
      }
    }

    return errors;
  };

  const handleValidate = () => {
    try {
      // Parse JSON
      let jsonData;
      try {
        jsonData = JSON.parse(jsonInput);
      } catch (e) {
        setValidationResult({
          valid: false,
          errors: [
            {
              path: 'JSON Input',
              message: `Invalid JSON: ${(e as Error).message}`,
            },
          ],
        });
        return;
      }

      // Parse Schema
      let schemaData;
      try {
        schemaData = JSON.parse(schemaInput);
      } catch (e) {
        setValidationResult({
          valid: false,
          errors: [
            {
              path: 'Schema Input',
              message: `Invalid JSON Schema: ${(e as Error).message}`,
            },
          ],
        });
        return;
      }

      // Validate
      const errors = validateJsonSchema(jsonData, schemaData);

      setValidationResult({
        valid: errors.length === 0,
        errors,
      });
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [
          {
            path: 'Validation',
            message: (error as Error).message,
          },
        ],
      });
    }
  };

  const loadSampleJson = () => {
    const sampleJson = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
      hobbies: ['reading', 'coding'],
    };
    setJsonInput(JSON.stringify(sampleJson, null, 2));
  };

  const loadSampleSchema = () => {
    const sampleSchema = {
      type: 'object',
      required: ['name', 'age', 'email'],
      properties: {
        name: {
          type: 'string',
          minLength: 1,
        },
        age: {
          type: 'number',
          minimum: 0,
          maximum: 150,
        },
        email: {
          type: 'string',
          pattern: '^[^@]+@[^@]+\\.[^@]+$',
        },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            zip: { type: 'string' },
          },
        },
        hobbies: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
        },
      },
      additionalProperties: false,
    };
    setSchemaInput(JSON.stringify(sampleSchema, null, 2));
  };

  const loadSample = () => {
    loadSampleJson();
    loadSampleSchema();
  };

  return (
    <ToolPageLayout
      seo={{
        title: "JSON Schema Validator - Free Online JSON Validation Tool",
        description: "Validate JSON data against JSON Schema specifications online. Free JSON Schema validator with detailed error reporting and support for all major JSON Schema features. Test your API responses and configuration files instantly.",
        keywords: "json schema validator, validate json schema, json validation tool, json schema online, api validator, json schema tester, schema validation, free json validator",
        path: "/tools/json-schema-validator"
      }}
      icon={CheckCircle}
      title="JSON Schema Validator"
      description="Validate JSON data against JSON Schema specifications with detailed error reporting"
      actions={
        <>
          <Button onClick={handleValidate} size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Validate
          </Button>
          <Button onClick={loadSample} variant="ghost" size="sm">
            Load Sample
          </Button>
        </>
      }
    >

      {validationResult && (
        <Card
          className={`p-6 relative overflow-hidden ${
            validationResult.valid
              ? 'border-green-500/50 bg-green-500/5'
              : 'border-destructive/50 bg-destructive/5'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            {validationResult.valid ? (
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                    Validation Successful
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    JSON data is valid according to the provided schema
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-destructive mb-1">
                      Validation Failed
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Found {validationResult.errors.length} error
                      {validationResult.errors.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {validationResult.errors.map((error, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm border border-destructive/20"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-mono text-sm font-semibold text-destructive mb-1">
                            {error.path}
                          </p>
                          <p className="text-sm text-muted-foreground">{error.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* JSON Input */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <FileJson className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold">JSON Data</h3>
            </div>
            <Button onClick={loadSampleJson} variant="ghost" size="sm">
              Load Sample
            </Button>
          </div>
          <CodeEditor
            value={jsonInput}
            onChange={setJsonInput}
            language="json"
            placeholder="Paste your JSON data here..."
            height="400px"
          />
        </Card>

        {/* Schema Input */}
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold">JSON Schema</h3>
            </div>
            <Button onClick={loadSampleSchema} variant="ghost" size="sm">
              Load Sample
            </Button>
          </div>
          <CodeEditor
            value={schemaInput}
            onChange={setSchemaInput}
            language="json"
            placeholder="Paste your JSON Schema here..."
            height="400px"
          />
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        <h3 className="text-lg font-bold mb-4 relative z-10">Supported JSON Schema Features</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm relative z-10">
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Type Validation</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>string, number, integer, boolean, array, object, null</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">String Validation</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>minLength, maxLength, pattern, enum</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Number Validation</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>minimum, maximum, integer type</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-muted-foreground">Object & Array</div>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>required, properties, additionalProperties</li>
              <li>items, minItems, maxItems</li>
            </ul>
          </div>
        </div>
      </Card>
    </ToolPageLayout>
  );
}
