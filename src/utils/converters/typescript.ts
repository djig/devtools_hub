/**
 * JSON to TypeScript converter utility
 * Generates TypeScript interfaces and types from JSON data
 */

export interface TypeScriptOptions {
  useInterface: boolean;       // true = interface, false = type alias
  exportTypes: boolean;        // add 'export' keyword
  optionalProperties: boolean; // mark all properties as optional
  readonlyProperties: boolean; // add readonly modifier
  addComments: boolean;        // add JSDoc comments
  rootName: string;            // name of root type (default: 'Root')
}

export const defaultOptions: TypeScriptOptions = {
  useInterface: true,
  exportTypes: true,
  optionalProperties: false,
  readonlyProperties: false,
  addComments: false,
  rootName: 'Root',
};

// Track generated types to avoid duplicates
interface GeneratedType {
  name: string;
  definition: string;
}

/**
 * Convert a string to PascalCase for type names
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, (char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Get the TypeScript type for a primitive value
 */
function getPrimitiveType(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'unknown';
}

/**
 * Generate a JSDoc comment for a property
 */
function generateComment(key: string, value: unknown, indent: string): string {
  const type = typeof value;
  let description = `The ${key} property`;

  if (value === null) {
    description = `The ${key} property (nullable)`;
  } else if (Array.isArray(value)) {
    description = `Array of ${key} items`;
  } else if (type === 'object') {
    description = `The ${key} object`;
  }

  return `${indent}/** ${description} */\n`;
}

/**
 * Infer TypeScript type from a JSON value
 */
function inferType(
  value: unknown,
  typeName: string,
  options: TypeScriptOptions,
  generatedTypes: GeneratedType[],
  depth: number = 0
): string {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'unknown[]';
    }

    // Get types of all array elements
    const elementTypes = new Set<string>();
    const objectElements: object[] = [];

    for (const item of value) {
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        objectElements.push(item as object);
      } else {
        elementTypes.add(inferType(item, typeName, options, generatedTypes, depth + 1));
      }
    }

    // If we have objects in the array, merge their types
    if (objectElements.length > 0) {
      const mergedObject = mergeObjects(objectElements);
      const itemTypeName = `${typeName}Item`;
      const objectType = generateObjectType(mergedObject, itemTypeName, options, generatedTypes, depth + 1);
      elementTypes.add(objectType);
    }

    const uniqueTypes = Array.from(elementTypes);
    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }
    return `(${uniqueTypes.join(' | ')})[]`;
  }

  if (typeof value === 'object') {
    return generateObjectType(value as Record<string, unknown>, typeName, options, generatedTypes, depth);
  }

  return getPrimitiveType(value);
}

/**
 * Merge multiple objects to get a combined type structure
 */
function mergeObjects(objects: object[]): Record<string, unknown> {
  const merged: Record<string, unknown[]> = {};

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      if (!merged[key]) {
        merged[key] = [];
      }
      merged[key].push(value);
    }
  }

  // Convert arrays of values to representative values
  const result: Record<string, unknown> = {};
  for (const [key, values] of Object.entries(merged)) {
    // Use the first non-null value as representative
    result[key] = values.find(v => v !== null) ?? null;
  }

  return result;
}

/**
 * Generate a TypeScript type definition for an object
 */
function generateObjectType(
  obj: Record<string, unknown>,
  typeName: string,
  options: TypeScriptOptions,
  generatedTypes: GeneratedType[],
  depth: number
): string {
  const indent = '  ';
  const properties: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Generate nested type name
    const nestedTypeName = toPascalCase(`${typeName}_${key}`);

    // Infer the type
    let propertyType = inferType(value, nestedTypeName, options, generatedTypes, depth + 1);

    // Handle null values - make them nullable
    if (value === null) {
      propertyType = 'null';
    }

    // Build the property line
    const optional = options.optionalProperties ? '?' : '';
    const readonly = options.readonlyProperties ? 'readonly ' : '';
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

    let propertyLine = '';
    if (options.addComments) {
      propertyLine += generateComment(key, value, indent);
    }
    propertyLine += `${indent}${readonly}${safeKey}${optional}: ${propertyType};`;

    properties.push(propertyLine);
  }

  // For top-level types, just return the type name
  // The actual definition is generated in the main jsonToTypeScript function
  if (depth === 0) {
    return typeName;
  }

  // For nested types at depth > 0, check if we should create a named type
  if (Object.keys(obj).length > 0) {
    const exportKeyword = options.exportTypes ? 'export ' : '';
    const typeKeyword = options.useInterface ? 'interface' : 'type';
    const assignment = options.useInterface ? '' : ' =';

    // Check if this type already exists
    const existingType = generatedTypes.find(t => t.name === typeName);
    if (!existingType) {
      const definition = `${exportKeyword}${typeKeyword} ${typeName}${assignment} {\n${properties.join('\n')}\n}`;
      generatedTypes.push({ name: typeName, definition });
    }

    return typeName;
  }

  // Empty object
  return 'Record<string, unknown>';
}

/**
 * Convert JSON string to TypeScript type definitions
 */
export function jsonToTypeScript(
  jsonString: string,
  options: Partial<TypeScriptOptions> = {}
): string {
  const mergedOptions: TypeScriptOptions = { ...defaultOptions, ...options };

  // Validate and sanitize root name
  let rootName = mergedOptions.rootName.trim();
  if (!rootName) {
    rootName = 'Root';
  }
  rootName = toPascalCase(rootName);

  // Parse JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Invalid JSON: ${(error as Error).message}`);
  }

  const generatedTypes: GeneratedType[] = [];

  // Handle different root types
  if (parsed === null) {
    return `${mergedOptions.exportTypes ? 'export ' : ''}type ${rootName} = null;`;
  }

  if (Array.isArray(parsed)) {
    const arrayType = inferType(parsed, rootName, mergedOptions, generatedTypes, 0);
    const exportKeyword = mergedOptions.exportTypes ? 'export ' : '';

    // Collect all generated types
    const typeDefinitions = generatedTypes.map(t => t.definition);
    typeDefinitions.push(`${exportKeyword}type ${rootName} = ${arrayType};`);

    return typeDefinitions.join('\n\n');
  }

  if (typeof parsed === 'object') {
    // Generate the root type
    const exportKeyword = mergedOptions.exportTypes ? 'export ' : '';
    const typeKeyword = mergedOptions.useInterface ? 'interface' : 'type';
    const assignment = mergedOptions.useInterface ? '' : ' =';

    const indent = '  ';
    const properties: string[] = [];

    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      const nestedTypeName = toPascalCase(`${rootName}_${key}`);
      const propertyType = inferType(value, nestedTypeName, mergedOptions, generatedTypes, 1);

      const optional = mergedOptions.optionalProperties ? '?' : '';
      const readonly = mergedOptions.readonlyProperties ? 'readonly ' : '';
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

      let propertyLine = '';
      if (mergedOptions.addComments) {
        propertyLine += generateComment(key, value, indent);
      }
      propertyLine += `${indent}${readonly}${safeKey}${optional}: ${propertyType};`;

      properties.push(propertyLine);
    }

    const rootDefinition = `${exportKeyword}${typeKeyword} ${rootName}${assignment} {\n${properties.join('\n')}\n}`;

    // Collect all generated types, nested types first
    const typeDefinitions = generatedTypes.map(t => t.definition);
    typeDefinitions.push(rootDefinition);

    return typeDefinitions.join('\n\n');
  }

  // Primitive root value
  const primitiveType = getPrimitiveType(parsed);
  return `${mergedOptions.exportTypes ? 'export ' : ''}type ${rootName} = ${primitiveType};`;
}
