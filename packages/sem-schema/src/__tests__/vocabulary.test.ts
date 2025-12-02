/**
 * Tests for SemSchema vocabulary definition
 * These tests verify that the custom vocabulary is properly defined and works
 */
import { validateSchema } from '../api';
import Ajv from 'ajv';

describe('Vocabulary Definition Tests', () => {
  let standardAjv: Ajv;

  beforeEach(() => {
    standardAjv = new Ajv({ strict: true }); // Standard AJV without SemSchema vocabulary
  });

  describe('Custom vocabulary vs Standard JSON Schema', () => {
    it('should FAIL with standard AJV but SUCCEED with SemSchema for format: json', () => {
      const schema = { type: 'string', format: 'json' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // SemSchema should succeed
      expect(validateSchema(schema)).toBe(true);
    });

    it('should FAIL with standard AJV but SUCCEED with SemSchema for format: html', () => {
      const schema = { type: 'string', format: 'html' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // SemSchema should succeed
      expect(validateSchema(schema)).toBe(true);
    });

    it('should FAIL with standard AJV but SUCCEED with SemSchema for format: text', () => {
      const schema = { type: 'string', format: 'text' };
      
      // Standard AJV should fail - unknown format
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // SemSchema should succeed
      expect(validateSchema(schema)).toBe(true);
    });

    it('should FAIL with standard AJV but SUCCEED with SemSchema for property-level required', () => {
      const schema = { type: 'string', required: true };
      
      // Standard AJV should fail - required must be array at object level
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // SemSchema should succeed
      expect(validateSchema(schema)).toBe(true);
    });

    it('should FAIL with standard AJV but SUCCEED with SemSchema for precision keyword', () => {
      const schema = { type: 'number', precision: 2 };
      
      // Standard AJV should fail - unknown keyword
      expect(() => standardAjv.compile(schema)).toThrow();
      
      // SemSchema should succeed
      expect(validateSchema(schema)).toBe(true);
    });
  });

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
  });

  describe('Schema Validity - Type inference', () => {
    it('should accept schema with only format property (type inferred)', () => {
      const schema = { format: 'json' };
      expect(validateSchema(schema)).toBe(true);
    });
  });
});
