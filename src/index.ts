/**
 * Custom JSON Schema Vocabulary
 * Main exports for the custom schema validation library
 */
export { 
  validateProduct, 
  validateFaqItem, 
  createCustomSchemaValidator,
  createAjvInstance, // Backward compatibility
  preprocessSchema,
  addCustomKeywords,
  vocabulary
} from './custom-schema';
