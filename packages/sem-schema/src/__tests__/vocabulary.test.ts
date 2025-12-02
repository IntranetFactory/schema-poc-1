/**
 * Tests for sem-schema vocabulary definition
 * These tests verify that the custom vocabulary is properly defined and works
 */
import { createSemSchemaValidator } from '../validator';
import { preprocessSchema } from '../utils';
import Ajv from 'ajv';

describe('Vocabulary Definition Tests', () => {
  let ajv: ReturnType<typeof createSemSchemaValidator>;
  let standardAjv: Ajv;

  beforeEach(() => {
    ajv = createSemSchemaValidator(); // AJV with SemSchema vocabulary
    standardAjv = new Ajv({ strict: true }); // Standard AJV without custom vocabulary
  });

  describe('Custom vocabulary vs Standard JSON Schema', () => {
    it('should FAIL with standard AJV but SUCCEED with custom vocabulary for format: json', () => {
      const schema = { type: 'string', format: 'json' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // Our custom vocabulary AJV should succeed
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should FAIL with standard AJV but SUCCEED with custom vocabulary for format: html', () => {
      const schema = { type: 'string', format: 'html' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // Our custom vocabulary AJV should succeed
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should FAIL with standard AJV but SUCCEED with custom vocabulary for format: text', () => {
      const schema = { type: 'string', format: 'text' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // Our custom vocabulary AJV should succeed
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should FAIL with standard AJV but SUCCEED with custom vocabulary for property-level required', () => {
      const schema = { type: 'string', required: true };
      
      // Standard AJV should fail - required must be array at object level
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // Our custom vocabulary AJV should succeed
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should FAIL with standard AJV but SUCCEED with custom vocabulary for precision keyword', () => {
      const schema = { type: 'number', precision: 2 };
      
      // Standard AJV should fail - unknown keyword
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // Our custom vocabulary AJV should succeed
      expect(() => ajv.compile(schema)).not.toThrow();
    });
  });

  describe('Schema Validity - Custom formats', () => {
    it('should accept schema with format: json', () => {
      const schema = { type: 'string', format: 'json' };
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should accept schema with format: html', () => {
      const schema = { type: 'string', format: 'html' };
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should accept schema with format: text', () => {
      const schema = { type: 'string', format: 'text' };
      expect(() => ajv.compile(schema)).not.toThrow();
    });
  });

  describe('Schema Validity - Property-level required', () => {
    it('should accept schema with property-level required: true', () => {
      const schema = { type: 'string', required: true };
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should accept schema with property-level required: false', () => {
      const schema = { type: 'string', required: false };
      expect(() => ajv.compile(schema)).not.toThrow();
    });
  });

  describe('Schema Validity - Precision keyword', () => {
    it('should accept schema with precision: 0', () => {
      const schema = { type: 'number', precision: 0 };
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should accept schema with precision: 2', () => {
      const schema = { type: 'number', precision: 2 };
      expect(() => ajv.compile(schema)).not.toThrow();
    });

    it('should accept schema with precision: 4', () => {
      const schema = { type: 'number', precision: 4 };
      expect(() => ajv.compile(schema)).not.toThrow();
    });
  });

  describe('Schema Validity - Type inference', () => {
    it('should accept schema with only format property after preprocessing', () => {
      const schema = { format: 'json' };
      const processed = preprocessSchema(schema);
      expect(processed.type).toBe('string');
      expect(() => ajv.compile(processed)).not.toThrow();
    });
  });
});
