import type { SchemaObject } from 'ajv';

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
 * Table keyword properties that must be strings
 * Corresponds to vocabulary.json table property definitions
 */
const TABLE_STRING_PROPERTIES = [
  'table_name',
  'singular',
  'plural',
  'singular_label',
  'plural_label',
  'icon_url',
  'description'
] as const;

/**
 * Valid sort order values for grid keyword
 */
const VALID_SORT_ORDERS = ['asc', 'desc'] as const;

/**
 * Valid inputMode values
 */
const VALID_INPUT_MODES = ['default', 'required', 'readonly', 'disabled', 'hidden'] as const;

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

  // Validate inputMode
  if ((schema as any).inputMode !== undefined) {
    const inputMode = (schema as any).inputMode;
    if (typeof inputMode !== 'string') {
      errors.push({
        path,
        message: `Invalid inputMode value. Must be a string, got ${typeof inputMode}`,
        keyword: 'inputMode',
        value: inputMode
      });
    } else if (!VALID_INPUT_MODES.includes(inputMode as any)) {
      errors.push({
        path,
        message: `Invalid inputMode value "${inputMode}". Must be one of: ${VALID_INPUT_MODES.join(', ')}`,
        keyword: 'inputMode',
        value: inputMode
      });
    }
  }

  // Validate required keyword
  // In SemSchema, required must be an array at object level (standard JSON Schema)
  // For property-level required validation, use inputMode: "required" instead
  if ((schema as any).required !== undefined) {
    const required = (schema as any).required;
    
    // Check if this is a property schema (has type/format but no properties)
    // Object schemas with properties can have required arrays
    const isPropertySchema = !schema.properties && (schema.type || schema.format);
    
    if (isPropertySchema && typeof required === 'boolean') {
      errors.push({
        path,
        message: `Invalid use of property-level "required: ${required}". Use "inputMode: 'required'" instead for required field validation`,
        keyword: 'required',
        value: required
      });
    } else if (!Array.isArray(required)) {
      errors.push({
        path,
        message: `Invalid required value. Must be an array of property names, got ${typeof required}`,
        keyword: 'required',
        value: required
      });
    } else {
      // Validate that all items in required array are strings
      for (let i = 0; i < required.length; i++) {
        if (typeof required[i] !== 'string') {
          errors.push({
            path,
            message: `Invalid required array item at index ${i}. Must be a string, got ${typeof required[i]}`,
            keyword: 'required',
            value: required[i]
          });
        }
      }
    }
  }

  // Validate table keyword
  if (schema.table !== undefined) {
    if (typeof schema.table !== 'object' || schema.table === null || Array.isArray(schema.table)) {
      errors.push({
        path,
        message: `Invalid table value. Must be an object`,
        keyword: 'table',
        value: schema.table
      });
    } else {
      // Validate table properties according to vocabulary definition
      const tableProps = schema.table as Record<string, any>;
      
      for (const prop of TABLE_STRING_PROPERTIES) {
        if (tableProps[prop] !== undefined && typeof tableProps[prop] !== 'string') {
          errors.push({
            path,
            message: `Invalid table.${prop} value. Must be a string, got ${typeof tableProps[prop]}`,
            keyword: 'table',
            value: tableProps[prop]
          });
        }
      }
    }
  }

  // Validate grid keyword
  if (schema.grid !== undefined) {
    if (typeof schema.grid !== 'object' || schema.grid === null || Array.isArray(schema.grid)) {
      errors.push({
        path,
        message: `Invalid grid value. Must be an object`,
        keyword: 'grid',
        value: schema.grid
      });
    } else {
      const gridProps = schema.grid as Record<string, any>;
      
      // Validate sortField (must be string if present)
      if (gridProps.sortField !== undefined && typeof gridProps.sortField !== 'string') {
        errors.push({
          path,
          message: `Invalid grid.sortField value. Must be a string, got ${typeof gridProps.sortField}`,
          keyword: 'grid',
          value: gridProps.sortField
        });
      }
      
      // Validate sortOrder (must be 'asc' or 'desc' if present)
      if (gridProps.sortOrder !== undefined) {
        if (typeof gridProps.sortOrder !== 'string') {
          errors.push({
            path,
            message: `Invalid grid.sortOrder value. Must be a string, got ${typeof gridProps.sortOrder}`,
            keyword: 'grid',
            value: gridProps.sortOrder
          });
        } else if (!VALID_SORT_ORDERS.includes(gridProps.sortOrder as any)) {
          errors.push({
            path,
            message: `Invalid grid.sortOrder value "${gridProps.sortOrder}". Must be one of: ${VALID_SORT_ORDERS.join(', ')}`,
            keyword: 'grid',
            value: gridProps.sortOrder
          });
        }
      }
    }
  }

  // Validate properties keyword usage and recursively validate property schemas
  if (schema.properties && typeof schema.properties === 'object') {
    // If properties is present, type must be 'object' (or not specified, which is okay for partial schemas)
    if (schema.type) {
      const types = Array.isArray(schema.type) ? schema.type : [schema.type];
      // Check if 'object' is one of the types
      if (!types.includes('object')) {
        errors.push({
          path,
          message: `Schema has "properties" keyword but type is "${Array.isArray(schema.type) ? schema.type.join('|') : schema.type}". When "properties" is present, type must be "object" or not specified`,
          keyword: 'properties',
          value: schema.properties
        });
      }
    }

    // Recursively validate each property
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
