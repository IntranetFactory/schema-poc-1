import { SchemaObject, ValidateFunction } from 'ajv';
import { createSemSchemaValidator } from './validator';
import { preprocessSchema, validateSchemaStructure } from './utils';

/**
 * Validate a JSON Schema against SemSchema vocabulary
 * 
 * @param schemaJson - The JSON Schema to validate
 * @returns true if the schema is valid and can be compiled, throws error if invalid
 */
export function validateSchema(schemaJson: SchemaObject): boolean {
  // First validate schema structure and collect all errors
  const structureErrors = validateSchemaStructure(schemaJson);
  
  if (structureErrors.length > 0) {
    // Format all errors with location info
    const errorMessages = structureErrors.map(err => 
      `${err.message} at ${err.path}`
    ).join('; ');
    throw new Error(`Invalid schema: ${errorMessages}`);
  }
  
  // Create fresh instance for schema validation
  const ajv = createSemSchemaValidator();
  const processed = preprocessSchema(schemaJson);
  
  try {
    ajv.compile(processed);
    return true;
  } catch (error) {
    throw new Error(`Invalid schema: ${error instanceof Error ? error.message : String(error)}`);
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
