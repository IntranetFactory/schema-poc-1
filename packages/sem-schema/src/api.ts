import type { SchemaObject, ValidateFunction } from 'ajv';
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
  // Create fresh instance for schema validation
  const ajv = createSemSchemaValidator();
  const processed = preprocessSchema(schemaJson);
  
  // First check custom keyword values with our manual validation
  const structureErrors = validateSchemaStructure(processed);
  if (structureErrors.length > 0) {
    return {
      valid: false,
      errors: structureErrors
    };
  }
  
  // Then let AJV compile and validate the schema
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
  // Validate schema first to catch invalid schemas before compilation
  const schemaValidation = validateSchema(schemaJson);
  if (!schemaValidation.valid) {
    const errorMessages = schemaValidation.errors?.map(e => e.message).join(', ') || 'Unknown validation error';
    throw new Error(`Invalid schema: ${errorMessages}`);
  }
  
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
  let errors = validate.errors ? [...validate.errors] : null;
  
  // Filter out format errors for empty strings
  // Empty strings are allowed even with formats - only inputMode:'required' enforces non-empty
  if (errors && schemaJson.properties && typeof data === 'object' && data !== null) {
    errors = errors.filter(error => {
      // Skip filtering if not a format error
      if (error.keyword !== 'format') return true;
      
      // Get the field name from the error path (e.g., '/email' -> 'email')
      const fieldName = error.instancePath.startsWith('/') 
        ? error.instancePath.substring(1) 
        : error.instancePath;
      
      if (!fieldName) return true;
      
      const fieldValue = data[fieldName];
      
      // If the value is empty string, don't validate format
      // (inputMode:'required' will catch empty strings separately)
      if (typeof fieldValue === 'string' && fieldValue === '') {
        return false; // Filter out (don't keep) format errors for empty strings
      }
      
      return true;
    });
  }
  
  // Custom validation for inputMode: "required"
  if (schemaJson.properties && typeof data === 'object' && data !== null) {
    const inputModeErrors: any[] = [];
    
    for (const [key, propSchema] of Object.entries(schemaJson.properties)) {
      if (typeof propSchema === 'object' && propSchema !== null) {
        const inputMode = (propSchema as any).inputMode;
        
        if (inputMode === 'required') {
          const value = data[key];
          
          // Check if value is null, undefined, or empty string
          if (value === null || value === undefined) {
            inputModeErrors.push({
              keyword: 'inputMode',
              message: `must not be null or undefined`,
              params: { inputMode: 'required' },
              instancePath: `/${key}`,
              schemaPath: `#/properties/${key}/inputMode`
            });
          } else if (typeof value === 'string' && value === '') {
            inputModeErrors.push({
              keyword: 'inputMode',
              message: `must not be empty`,
              params: { inputMode: 'required' },
              instancePath: `/${key}`,
              schemaPath: `#/properties/${key}/inputMode`
            });
          }
        }
      }
    }
    
    // Merge inputMode errors with AJV errors
    if (inputModeErrors.length > 0) {
      errors = errors ? [...errors, ...inputModeErrors] : inputModeErrors;
    }
  }
  
  return {
    valid: errors === null || errors.length === 0,
    errors: errors && errors.length > 0 ? errors : null
  };
}
