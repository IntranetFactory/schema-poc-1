/**
 * Tests for SemSchema vocabulary definition
 * These tests verify that the custom vocabulary is properly defined and works
 */
import { validateSchema } from '../api';

describe('Vocabulary Definition Tests', () => {
  describe('Schema Validity - Custom formats', () => {
    it('should accept schema with format: json', () => {
      const schema = { type: 'string', format: 'json' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with format: html', () => {
      const schema = { type: 'string', format: 'html' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with format: text', () => {
      const schema = { type: 'string', format: 'text' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });
  });

  describe('Schema Validity - Property-level required', () => {
    it('should accept schema with property-level required: true', () => {
      const schema = { type: 'string', required: true };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with property-level required: false', () => {
      const schema = { type: 'string', required: false };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });
  });

  describe('Schema Validity - Precision keyword', () => {
    it('should accept schema with precision: 0', () => {
      const schema = { type: 'number', precision: 0 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with precision: 2', () => {
      const schema = { type: 'number', precision: 2 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with precision: 4', () => {
      const schema = { type: 'number', precision: 4 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should reject schema with invalid precision: -2', () => {
      const schema = { type: 'number', precision: -2 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid precision value "-2"');
      expect(result.errors?.[0]?.schemaPath).toBe('#');
    });

    it('should reject schema with invalid precision: 1.5', () => {
      const schema = { type: 'number', precision: 1.5 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid precision value "1.5"');
      expect(result.errors?.[0]?.schemaPath).toBe('#');
    });

    it('should reject schema with invalid precision: 5', () => {
      const schema = { type: 'number', precision: 5 };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid precision value "5"');
    });
  });

  describe('Schema Validity - Type inference', () => {
    it('should accept schema with only format property (type inferred)', () => {
      const schema = { format: 'json' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });
  });

  describe('Schema Validity - Unknown formats', () => {
    it('should reject schema with unknown format', () => {
      const schema = { type: 'string', format: 'emailx' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Unknown format "emailx"');
      expect(result.errors?.[0]?.schemaPath).toBe('#');
    });

    it('should reject schema with unknown format in nested properties', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'emailx' }
        }
      };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Unknown format "emailx"');
      expect(result.errors?.[0]?.schemaPath).toBe('#/properties/email');
    });

    it('should reject schema with unknown format in array items', () => {
      const schema = {
        type: 'array',
        items: { type: 'string', format: 'unknownFormat' }
      };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Unknown format "unknownFormat"');
      expect(result.errors?.[0]?.schemaPath).toBe('#/items');
    });
  });

  describe('Schema Validity - Standard formats', () => {
    it('should accept schema with format: email', () => {
      const schema = { type: 'string', format: 'email' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with format: date', () => {
      const schema = { type: 'string', format: 'date' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with format: uri', () => {
      const schema = { type: 'string', format: 'uri' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with format: uuid', () => {
      const schema = { type: 'string', format: 'uuid' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });
  });

  describe('Schema Validity - Invalid types', () => {
    it('should reject schema with invalid type', () => {
      const schema = { type: 'stringy' };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid type "stringy"');
      expect(result.errors?.[0]?.schemaPath).toBe('#');
    });

    it('should reject schema with invalid type in nested property', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'stringx' }
        }
      };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid type "stringx"');
      expect(result.errors?.[0]?.schemaPath).toBe('#/properties/name');
    });
  });

  describe('Schema Validity - Properties with wrong type', () => {
    it('should reject schema with type: string but has properties object', () => {
      const schema = {
        type: 'string',
        properties: {
          value: {
            type: 'string'
          },
          type: {
            type: 'string'
          }
        }
      };
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('properties');
      expect(result.errors?.[0]?.schemaPath).toBe('#');
    });

    it('should accept schema with properties but no type (partial schema)', () => {
      // When type is not specified, properties is allowed (common in partial schemas)
      const schema = {
        properties: {
          value: {
            type: 'string'
          },
          type: {
            type: 'string'
          }
        }
      };
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
    });

    it('should reject complex schema from issue with incorrect email property', () => {
      const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Person",
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "minLength": 1
          },
          "age": {
            "type": "integer",
            "minimum": 0,
            "maximum": 120
          },
          "email": {
            "type": "string",
            "properties": {
              "value": {
                "type": "string"
              },
              "type": {
                "type": "string"
              }
            }
          },
          "isActive": {
            "type": "boolean"
          }
        },
        "required": ["name", "email"],
        "additionalProperties": false
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      // Should have an error on the email property
      const emailError = result.errors?.find(e => e.schemaPath.includes('email'));
      expect(emailError).toBeDefined();
      expect(emailError?.message).toContain('properties');
    });
  });

  describe('Schema Validity - Multiple errors', () => {
    it('should report all errors in a schema', () => {
      const schema = {
        type: 'object',
        properties: {
          name: {
            type: 'stringy',
            required: true
          },
          email: {
            type: 'stringx',
            format: 'emailx'
          },
          age: {
            type: 'number',
            precision: 1.2
          }
        },
        required: ['name']
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBe(4);
      
      // Check that all errors are present
      const errorMessages = result.errors?.map(e => e.message).join(' ');
      const errorPaths = result.errors?.map(e => e.schemaPath).join(' ');
      
      expect(errorMessages).toContain('Invalid type "stringy"');
      expect(errorPaths).toContain('#/properties/name');
      expect(errorMessages).toContain('Invalid type "stringx"');
      expect(errorPaths).toContain('#/properties/email');
      expect(errorMessages).toContain('Unknown format "emailx"');
      expect(errorPaths).toContain('#/properties/email');
      expect(errorMessages).toContain('Invalid precision value "1.2"');
      expect(errorPaths).toContain('#/properties/age');
    });
  });

  describe('Schema Validity - Table property', () => {
    it('should accept schema with table object containing all required properties', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: {
          table_name: 'persons',
          singular: 'person',
          plural: 'persons',
          singular_label: 'Person',
          plural_label: 'Persons',
          icon_url: '/icons/person.svg',
          description: 'A person or user profile'
        },
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with table object containing minimal properties', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: {
          table_name: 'persons'
        },
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema without table property', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should accept schema with empty table object (all properties optional)', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: {},
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should reject schema with table_name as number', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: {
          table_name: 123,
          singular: true
        },
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThanOrEqual(1);
      expect(result.errors?.[0]?.message).toContain('table.table_name');
      expect(result.errors?.[0]?.message).toContain('Must be a string');
    });

    it('should reject schema with table as non-object', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: 'invalid',
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Invalid table value');
      expect(result.errors?.[0]?.message).toContain('Must be an object');
    });

    it('should reject schema with multiple invalid table properties', () => {
      const schema = {
        type: 'object',
        title: 'Person',
        table: {
          table_name: 123,
          singular: false,
          plural: null,
          icon_url: 456
        },
        properties: {
          name: { type: 'string' }
        }
      };
      
      const result = validateSchema(schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThanOrEqual(3); // At least 3 errors
      
      const errorMessages = result.errors?.map(e => e.message).join(' ');
      expect(errorMessages).toContain('table.table_name');
      expect(errorMessages).toContain('table.singular');
      expect(errorMessages).toContain('Must be a string');
    });
  });
});
