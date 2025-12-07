import { SchemaObject, ValidateFunction } from 'ajv';
import { createSemSchemaValidator } from './validator';
import { preprocessSchema, validateSchemaStructure } from './utils';

/**
 * Validate a JSON Schema against SemSchema vocabulary
 * 
 * @param schemaJson - The JSON Schema to validate
 * @returns Object with:
 *   - valid: boolean - true if schema is valid, false otherwise
 *   - errors: array | null - array of validation error objects if invalid, null if valid
 */
export function validateSchema(schemaJson: SchemaObject): {
  valid: boolean;
  errors: any[] | null;
} {
  // First validate schema structure and collect all errors
  const structureErrors = validateSchemaStructure(schemaJson);
  
  if (structureErrors.length > 0) {
    // Return errors in consistent format with validateData
    return {
      valid: false,
      errors: structureErrors.map(err => ({
        keyword: err.keyword || 'schema',
        message: err.message,
        params: { value: err.value },
        schemaPath: err.path,
        instancePath: err.path
      }))
    };
  }
  
  // Create fresh instance for schema validation
  const ajv = createSemSchemaValidator();
  const processed = preprocessSchema(schemaJson);
  
  try {
    ajv.compile(processed);
    return {
      valid: true,
      errors: null
    };
  } catch (error) {
    // Return AJV compilation errors in consistent format
    return {
      valid: false,
      errors: [{
        keyword: 'schema',
        message: error instanceof Error ? error.message : String(error),
        params: {},
        schemaPath: '#',
        instancePath: '#'
      }]
    };
  }
}

/**
 * Validate data against a JSON Schema using SemSchema vocabulary
 * 
 * Note: This function assumes the schema is valid. For best practice, 
 * validate the schema first using validateSchema() to catch schema errors
 * before attempting data validation.
 * 
 * @param data - The data to validate
 * @param schemaJson - The JSON Schema to validate against
 * @returns Object with:
 *   - valid: boolean - true if data is valid, false otherwise
 *   - errors: array | null - array of error objects if invalid, null if valid
 */
export function validateData(data: any, schemaJson: SchemaObject): {
  valid: boolean;
  errors: any[] | null;
} {
  // Create fresh instance for each validation to avoid schema caching issues
  const ajv = createSemSchemaValidator();
  const processed = preprocessSchema(schemaJson);
  
  let validate: ValidateFunction;
  try {
    validate = ajv.compile(processed);
  } catch (error) {
    throw new Error(`Invalid schema: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  const valid = validate(data);
  return {
    valid,
    errors: validate.errors ? [...validate.errors] : null
  };
}
