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
});
