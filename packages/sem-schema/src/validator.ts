import Ajv from 'ajv';
import { addAllFormats } from './formats';
import { addAllKeywords } from './keywords';

/**
 * Create and configure AJV instance with sem-schema vocabulary
 * 
 * This instance supports:
 * - Custom formats: json, html, text
 * - Property-level required keyword (validates non-empty strings)
 * - Number precision keyword (0-4 decimal places)
 * - Type inference (format without type defaults to string)
 */
export function createCustomSchemaValidator(): Ajv {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateFormats: true,
    validateSchema: false  // Allow custom keywords in schemas
  });
  
  // Add all custom formats
  addAllFormats(ajv);
  
  // Add all custom keywords
  addAllKeywords(ajv);
  
  return ajv;
}

// Backward compatibility alias
export const createAjvInstance = createCustomSchemaValidator;
