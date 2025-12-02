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

  // Add custom keyword: required (property-level required validation)
  // First remove the built-in object-level 'required' keyword
  // Then add our property-level version for strings
  ajv.removeKeyword('required');
  ajv.addKeyword({
    keyword: 'required',
    type: ['string', 'object'],  // Support both property-level (string) and object-level (object)
    schemaType: ['boolean', 'array'],  // boolean for property-level, array for object-level
    compile(schema: boolean | string[]) {
      // Handle object-level required (array of property names)
      if (Array.isArray(schema)) {
        return function validate(data: any): boolean {
          if (typeof data !== 'object' || data === null) return true;
          
          for (const prop of schema) {
            if (!(prop in data)) {
              (validate as any).errors = [{
                keyword: 'required',
                message: `must have required property '${prop}'`,
                params: { missingProperty: prop },
                instancePath: '',
                schemaPath: ''
              } as ErrorObject];
              return false;
            }
          }
          return true;
        };
      }
      
      // Handle property-level required (boolean for strings)
      return function validate(data: string): boolean {
        if (schema === true) {
          // Empty string violates required
          if (data === '') {
            (validate as any).errors = [{
              keyword: 'required',
              message: 'must not be empty',
              params: { required: true },
              instancePath: '',
              schemaPath: ''
            } as ErrorObject];
            return false;
          }
        }
        return true;
      };
    },
    errors: true,
    metaSchema: {
      anyOf: [
        { type: 'boolean' },
        { type: 'array', items: { type: 'string' } }
      ]
    }
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
    validateFormats: true,
    validateSchema: false  // Allow custom keywords in schemas
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
