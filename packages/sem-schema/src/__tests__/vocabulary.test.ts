/**
 * Tests for SemSchema vocabulary definition
 * These tests verify that the custom vocabulary is properly defined and works
 */
import { validateSchema } from '../api';

describe('Vocabulary Definition Tests', () => {
  describe('Schema Validity - Custom formats', () => {
    it('should accept schema with format: json', () => {
      const schema = { type: 'string', format: 'json' };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with format: html', () => {
      const schema = { type: 'string', format: 'html' };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with format: text', () => {
      const schema = { type: 'string', format: 'text' };
      expect(validateSchema(schema)).toBe(true);
    });
  });

  describe('Schema Validity - Property-level required', () => {
    it('should accept schema with property-level required: true', () => {
      const schema = { type: 'string', required: true };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with property-level required: false', () => {
      const schema = { type: 'string', required: false };
      expect(validateSchema(schema)).toBe(true);
    });
  });

  describe('Schema Validity - Precision keyword', () => {
    it('should accept schema with precision: 0', () => {
      const schema = { type: 'number', precision: 0 };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with precision: 2', () => {
      const schema = { type: 'number', precision: 2 };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with precision: 4', () => {
      const schema = { type: 'number', precision: 4 };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should reject schema with invalid precision: -2', () => {
      const schema = { type: 'number', precision: -2 };
      expect(() => validateSchema(schema)).toThrow('Invalid precision value "-2"');
      expect(() => validateSchema(schema)).toThrow('at #');
    });

    it('should reject schema with invalid precision: 1.5', () => {
      const schema = { type: 'number', precision: 1.5 };
      expect(() => validateSchema(schema)).toThrow('Invalid precision value "1.5"');
      expect(() => validateSchema(schema)).toThrow('at #');
    });

    it('should reject schema with invalid precision: 5', () => {
      const schema = { type: 'number', precision: 5 };
      expect(() => validateSchema(schema)).toThrow('Invalid precision value "5"');
    });
  });

  describe('Schema Validity - Type inference', () => {
    it('should accept schema with only format property (type inferred)', () => {
      const schema = { format: 'json' };
      expect(validateSchema(schema)).toBe(true);
    });
  });

  describe('Schema Validity - Unknown formats', () => {
    it('should reject schema with unknown format', () => {
      const schema = { type: 'string', format: 'emailx' };
      expect(() => validateSchema(schema)).toThrow('Unknown format "emailx"');
    });

    it('should reject schema with unknown format in nested properties', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'emailx' }
        }
      };
      expect(() => validateSchema(schema)).toThrow('Unknown format "emailx"');
    });

    it('should reject schema with unknown format in array items', () => {
      const schema = {
        type: 'array',
        items: { type: 'string', format: 'unknownFormat' }
      };
      expect(() => validateSchema(schema)).toThrow('Unknown format "unknownFormat"');
    });
  });

  describe('Schema Validity - Standard formats', () => {
    it('should accept schema with format: email', () => {
      const schema = { type: 'string', format: 'email' };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with format: date', () => {
      const schema = { type: 'string', format: 'date' };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with format: uri', () => {
      const schema = { type: 'string', format: 'uri' };
      expect(validateSchema(schema)).toBe(true);
    });

    it('should accept schema with format: uuid', () => {
      const schema = { type: 'string', format: 'uuid' };
      expect(validateSchema(schema)).toBe(true);
    });
  });

  describe('Schema Validity - Invalid types', () => {
    it('should reject schema with invalid type', () => {
      const schema = { type: 'stringy' };
      expect(() => validateSchema(schema)).toThrow('Invalid type "stringy"');
      expect(() => validateSchema(schema)).toThrow('at #');
    });

    it('should reject schema with invalid type in nested property', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'stringx' }
        }
      };
      expect(() => validateSchema(schema)).toThrow('Invalid type "stringx"');
      expect(() => validateSchema(schema)).toThrow('at #/properties/name');
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
      
      expect(() => validateSchema(schema)).toThrow();
      
      try {
        validateSchema(schema);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Check that all errors are present
        expect(message).toContain('Invalid type "stringy"');
        expect(message).toContain('#/properties/name');
        expect(message).toContain('Invalid type "stringx"');
        expect(message).toContain('#/properties/email');
        expect(message).toContain('Unknown format "emailx"');
        expect(message).toContain('#/properties/email');
        expect(message).toContain('Invalid precision value "1.2"');
        expect(message).toContain('#/properties/age');
      }
    });
  });
});
