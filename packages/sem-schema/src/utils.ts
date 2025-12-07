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
 * Valid JSON Schema types
 */
const VALID_TYPES = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'object',
  'array',
  'null'
]);

/**
 * Schema validation error
 */
export interface SchemaValidationError {
  path: string;
  message: string;
  keyword?: string;
  value?: any;
}

/**
 * Validate a schema and collect all errors
 * 
 * @param schema - The schema to validate
 * @param path - Current path in schema (for error messages)
 * @returns Array of validation errors (empty if valid)
 */
export function validateSchemaStructure(schema: SchemaObject, path: string = '#'): SchemaValidationError[] {
  const errors: SchemaValidationError[] = [];

  if (typeof schema !== 'object' || schema === null) {
    return errors;
  }

  // Validate format
  if (schema.format && typeof schema.format === 'string') {
    if (!KNOWN_FORMATS.has(schema.format)) {
      errors.push({
        path,
        message: `Unknown format "${schema.format}"`,
        keyword: 'format',
        value: schema.format
      });
    }
  }

  // Validate type
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    for (const type of types) {
      if (typeof type !== 'string') {
        errors.push({
          path,
          message: `Invalid type value. Type must be a string, got ${typeof type}`,
          keyword: 'type',
          value: type
        });
      } else if (!VALID_TYPES.has(type)) {
        errors.push({
          path,
          message: `Invalid type "${type}". Must be one of: ${Array.from(VALID_TYPES).join(', ')}`,
          keyword: 'type',
          value: type
        });
      }
    }
  }

  // Validate precision
  if (schema.precision !== undefined) {
    const precision = schema.precision;
    if (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0 || precision > 4) {
      errors.push({
        path,
        message: `Invalid precision value "${precision}". Must be an integer between 0 and 4`,
        keyword: 'precision',
        value: precision
      });
    }
  }

  // Validate required (property-level boolean or object-level array)
  if (schema.required !== undefined) {
    if (typeof schema.required === 'boolean') {
      // Property-level: valid
    } else if (Array.isArray(schema.required)) {
      // Object-level: validate array contents
      for (const item of schema.required) {
        if (typeof item !== 'string') {
          errors.push({
            path,
            message: `Invalid required array. All elements must be strings, got ${typeof item}`,
            keyword: 'required',
            value: schema.required
          });
          break; // Only report once per array
        }
      }
    } else {
      errors.push({
        path,
        message: `Invalid required value. Must be boolean (property-level) or array (object-level)`,
        keyword: 'required',
        value: schema.required
      });
    }
  }

  // Recursively validate properties
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [key, value] of Object.entries(schema.properties)) {
      if (typeof value === 'object' && value !== null) {
        errors.push(...validateSchemaStructure(value as SchemaObject, `${path}/properties/${key}`));
      }
    }
  }

  // Validate items
  if (schema.items && typeof schema.items === 'object') {
    errors.push(...validateSchemaStructure(schema.items as SchemaObject, `${path}/items`));
  }

  // Validate oneOf, anyOf, allOf
  const compositionKeywords = ['oneOf', 'anyOf', 'allOf'] as const;
  for (const keyword of compositionKeywords) {
    const value = schema[keyword];
    if (Array.isArray(value)) {
      value.forEach((subSchema, index) => {
        if (typeof subSchema === 'object' && subSchema !== null) {
          errors.push(...validateSchemaStructure(subSchema as SchemaObject, `${path}/${keyword}/${index}`));
        }
      });
    }
  }

  // Validate not
  if (schema.not && typeof schema.not === 'object') {
    errors.push(...validateSchemaStructure(schema.not as SchemaObject, `${path}/not`));
  }

  // Validate if/then/else
  if (schema.if && typeof schema.if === 'object') {
    errors.push(...validateSchemaStructure(schema.if as SchemaObject, `${path}/if`));
  }
  if (schema.then && typeof schema.then === 'object') {
    errors.push(...validateSchemaStructure(schema.then as SchemaObject, `${path}/then`));
  }
  if (schema.else && typeof schema.else === 'object') {
    errors.push(...validateSchemaStructure(schema.else as SchemaObject, `${path}/else`));
  }

  return errors;
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
