import Ajv, { SchemaObject, ErrorObject } from 'ajv';

/**
 * Custom format validation for 'json' format
 */
function validateJsonFormat(data: string): boolean {
  try {
    JSON.parse(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Custom format validation for 'html' format
 * Basic validation: checks if string contains HTML-like tags
 */
function validateHtmlFormat(data: string): boolean {
  // Basic check for HTML tags
  return /<[a-z][\s\S]*>/i.test(data);
}

/**
 * Custom format validation for 'text' format
 * Text format allows multiline strings
 */
function validateTextFormat(data: string): boolean {
  // Text format is always valid for strings
  return typeof data === 'string';
}

/**
 * Add custom keywords to AJV instance
 */
export function addCustomKeywords(ajv: Ajv): void {
  // Add custom format: json
  ajv.addFormat('json', {
    type: 'string',
    validate: validateJsonFormat
  });

  // Add custom format: html
  ajv.addFormat('html', {
    type: 'string',
    validate: validateHtmlFormat
  });

  // Add custom format: text (multiline string)
  ajv.addFormat('text', {
    type: 'string',
    validate: validateTextFormat
  });

  // Add custom keyword: requiredProperty (property-level required validation)
  // Note: We use 'requiredProperty' instead of 'required' to avoid conflict with JSON Schema's 'required' keyword
  ajv.addKeyword({
    keyword: 'requiredProperty',
    type: 'string',
    schemaType: 'boolean',
    compile(schema: boolean) {
      const validateFn = function validate(data: string, context?: any): boolean {
        if (schema === true) {
          // Empty string violates requiredProperty
          // Note: null/undefined checks are not needed as AJV only passes strings to this validator
          if (data === '') {
            (validate as any).errors = [{
              keyword: 'requiredProperty',
              message: 'must not be empty',
              params: { requiredProperty: true },
              instancePath: context?.instancePath || '',
              schemaPath: context?.schemaPath || ''
            } as ErrorObject];
            return false;
          }
        }
        return true;
      };
      return validateFn;
    },
    errors: true
  });

  // Add custom keyword: precision for numbers
  // Precision limit is set to 0-4 to match common use cases (integers, currency, percentages, etc.)
  ajv.addKeyword({
    keyword: 'precision',
    type: 'number',
    schemaType: 'number',
    compile(schema: number) {
      const validateFn = function validate(data: number): boolean {
        // Validate schema value
        if (!Number.isInteger(schema) || schema < 0 || schema > 4) {
          (validate as any).errors = [{
            keyword: 'precision',
            message: 'precision must be an integer between 0 and 4',
            params: { precision: schema },
            instancePath: '',
            schemaPath: ''
          } as ErrorObject];
          return false;
        }

        // Check the number of decimal places
        // Note: Uses string conversion which may have floating-point precision issues
        // For most practical cases (currency, measurements), this is acceptable
        const decimalPart = (data.toString().split('.')[1] || '');
        if (decimalPart.length > schema) {
          (validate as any).errors = [{
            keyword: 'precision',
            message: `must have at most ${schema} decimal places`,
            params: { precision: schema, actual: decimalPart.length },
            instancePath: '',
            schemaPath: ''
          } as ErrorObject];
          return false;
        }
        return true;
      };
      return validateFn;
    },
    errors: true
  });
}

/**
 * Create and configure AJV instance with custom keywords
 */
export function createAjvInstance(): Ajv {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateFormats: true
  });
  
  addCustomKeywords(ajv);
  
  return ajv;
}

/**
 * Preprocess schema to handle default type as string
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
