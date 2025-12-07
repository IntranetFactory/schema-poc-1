import type { ErrorObject } from 'ajv';
import Ajv from 'ajv';

/**
 * Add custom 'required' keyword to AJV instance
 * 
 * Supports two modes:
 * - Property-level: required: true (boolean) → validates value is not null/undefined, and strings are not empty
 * - Object-level: required: ["prop"] (array) for objects → validates property exists
 * 
 * This replaces AJV's built-in required keyword to support both use cases
 */
export function addRequiredKeyword(ajv: Ajv): void {
  // Remove the built-in object-level 'required' keyword
  ajv.removeKeyword('required');
  
  // Add our custom version that handles both property-level and object-level
  ajv.addKeyword({
    keyword: 'required',
    type: ['string', 'number', 'boolean', 'object', 'array', 'null'],  // Support property-level on any type
    schemaType: ['boolean', 'array'],  // boolean for property-level, array for object-level
    compile(schema: boolean | string[]) {
      // Handle object-level required (array of property names)
      if (Array.isArray(schema)) {
        return function validate(data: any): boolean {
          // Only validate objects (not arrays or null)
          if (typeof data !== 'object' || data === null || Array.isArray(data)) return true;
          
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
      
      // Handle property-level required (boolean for any type)
      return function validate(data: any): boolean {
        if (schema === true) {
          // null or undefined violates required
          if (data === null || data === undefined) {
            (validate as any).errors = [{
              keyword: 'required',
              message: 'must not be null or undefined',
              params: { required: true },
              instancePath: '',
              schemaPath: ''
            } as ErrorObject];
            return false;
          }
          
          // Empty string violates required (for any string regardless of format)
          if (typeof data === 'string' && data === '') {
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
}
