/**
 * Custom JSON Schema Vocabulary
 * 
 * This module provides a custom JSON Schema vocabulary with additional validation features:
 * - Custom formats: json, html, text
 * - Property-level required (validates non-empty strings)
 * - Number precision (0-4 decimal places)
 * - Type inference (format without type defaults to string)
 */

export { 
  createCustomSchemaValidator,
  createAjvInstance, // Backward compatibility
  addCustomKeywords,
  preprocessSchema 
} from './validator';

export { validateProduct, validateFaqItem } from './compiled-validators';

// Re-export vocabulary definition
export { default as vocabulary } from './vocabulary.json';
