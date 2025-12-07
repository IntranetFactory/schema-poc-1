import { SchemaObject } from 'ajv';

/**
 * Known formats - includes both custom and standard formats
 */
const KNOWN_FORMATS = new Set([
  // Custom SemSchema formats
  'json',
  'html',
  'text',
  // Standard JSON Schema formats (from ajv-formats)
  'date',
  'time',
  'date-time',
  'duration',
  'uri',
  'uri-reference',
  'uri-template',
  'url',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'regex',
  'uuid',
  'json-pointer',
  'json-pointer-uri-fragment',
  'relative-json-pointer',
  'byte',
  'int32',
  'int64',
  'float',
  'double',
  'password',
  'binary',
]);

/**
 * Validate that all formats in a schema are known
 * 
 * @param schema - The schema to validate
 * @param path - Current path in schema (for error messages)
 * @throws Error if an unknown format is found
 */
export function validateKnownFormats(schema: SchemaObject, path: string = '#'): void {
  if (typeof schema !== 'object' || schema === null) {
    return;
  }

  // Check if this schema object has a format
  if (schema.format && typeof schema.format === 'string') {
    if (!KNOWN_FORMATS.has(schema.format)) {
      throw new Error(`Unknown format "${schema.format}" at ${path}`);
    }
  }

  // Recursively check properties
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [key, value] of Object.entries(schema.properties)) {
      if (typeof value === 'object' && value !== null) {
        validateKnownFormats(value as SchemaObject, `${path}/properties/${key}`);
      }
    }
  }

  // Check items
  if (schema.items && typeof schema.items === 'object') {
    validateKnownFormats(schema.items as SchemaObject, `${path}/items`);
  }

  // Check oneOf, anyOf, allOf
  ['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (Array.isArray(schema[keyword])) {
      (schema[keyword] as SchemaObject[]).forEach((subSchema, index) => {
        if (typeof subSchema === 'object' && subSchema !== null) {
          validateKnownFormats(subSchema, `${path}/${keyword}/${index}`);
        }
      });
    }
  });

  // Check not
  if (schema.not && typeof schema.not === 'object') {
    validateKnownFormats(schema.not as SchemaObject, `${path}/not`);
  }

  // Check if/then/else
  if (schema.if && typeof schema.if === 'object') {
    validateKnownFormats(schema.if as SchemaObject, `${path}/if`);
  }
  if (schema.then && typeof schema.then === 'object') {
    validateKnownFormats(schema.then as SchemaObject, `${path}/then`);
  }
  if (schema.else && typeof schema.else === 'object') {
    validateKnownFormats(schema.else as SchemaObject, `${path}/else`);
  }
}

/**
 * Preprocess schema to handle default type as string
 * 
 * When a schema has a format but no type, this function adds type: "string"
 * This allows schemas like { format: "json" } to work correctly
 */
export function preprocessSchema(schema: SchemaObject): SchemaObject {
  if (typeof schema !== 'object' || schema === null) {
    return schema;
  }

  const processed: SchemaObject = { ...schema };

  // If format is provided but type is not, default to string
  if (processed.format && !processed.type) {
    processed.type = 'string';
  }

  // Process properties recursively
  if (processed.properties && typeof processed.properties === 'object') {
    const newProperties: Record<string, SchemaObject> = {};
    for (const [key, value] of Object.entries(processed.properties)) {
      if (typeof value === 'object' && value !== null) {
        newProperties[key] = preprocessSchema(value as SchemaObject);
      } else {
        newProperties[key] = value as SchemaObject;
      }
    }
    processed.properties = newProperties;
  }

  // Process items if it's an array schema
  if (processed.items && typeof processed.items === 'object') {
    processed.items = preprocessSchema(processed.items as SchemaObject);
  }

  // Process oneOf, anyOf, allOf
  ['oneOf', 'anyOf', 'allOf'].forEach((keyword) => {
    if (Array.isArray(processed[keyword])) {
      processed[keyword] = (processed[keyword] as SchemaObject[]).map(s => preprocessSchema(s));
    }
  });

  return processed;
}
