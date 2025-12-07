import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { addAllFormats } from './formats';
import { addAllKeywords } from './keywords';

/**
 * Create and configure AJV instance with SemSchema vocabulary
 * 
 * This instance supports:
 * - Custom formats: json, html, text
 * - Standard formats: date, time, email, uri, etc. (from ajv-formats)
 * - Property-level required keyword (validates non-empty strings)
 * - Number precision keyword (0-4 decimal places)
 * - Type inference (format without type defaults to string)
 */
export function createSemSchemaValidator(): Ajv {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    validateFormats: true,
    validateSchema: false  // Allow custom keywords in schemas
  });
  
  // Add standard formats (date, time, email, uri, etc.)
  addFormats(ajv);
  
  // Add all custom formats
  addAllFormats(ajv);
  
  // Add all custom keywords
  addAllKeywords(ajv);
  
  return ajv;
}
