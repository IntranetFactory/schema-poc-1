/**
 * sem-schema: Custom JSON Schema Vocabulary
 * 
 * A custom JSON Schema vocabulary with additional validation features:
 * - Custom formats: json, html, text
 * - Property-level required (validates non-empty strings)
 * - Number precision (0-4 decimal places)
 * - Type inference (format without type defaults to string)
 */

// Main validator
export { 
  createCustomSchemaValidator,
  createAjvInstance // Backward compatibility
} from './validator';

// Utilities
export { preprocessSchema } from './utils';

// Formats
export {
  validateJsonFormat,
  validateHtmlFormat,
  validateTextFormat,
  addJsonFormat,
  addHtmlFormat,
  addTextFormat,
  addAllFormats
} from './formats';

// Keywords
export {
  addRequiredKeyword,
  addPrecisionKeyword,
  addAllKeywords
} from './keywords';

// Vocabulary definition
export { default as vocabulary } from './vocabulary.json';
