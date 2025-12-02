/**
 * SemSchema: Custom JSON Schema Vocabulary
 * 
 * A custom JSON Schema vocabulary with additional validation features:
 * - Custom formats: json, html, text
 * - Property-level required (validates non-empty strings)
 * - Number precision (0-4 decimal places)
 * - Type inference (format without type defaults to string)
 */

// Main validator
export { createSemSchemaValidator } from './validator';

// Utilities
export { preprocessSchema } from './utils';

// Vocabulary definition
export { default as vocabulary } from './vocabulary.json';
