/**
 * Tests for data validation using sem-schema vocabulary
 * These tests verify that data correctly validates against schemas using custom keywords
 */
import { createCustomSchemaValidator } from '../validator';
import { preprocessSchema } from '../utils';

describe('Data Validation Tests', () => {
  let ajv: ReturnType<typeof createCustomSchemaValidator>;

  beforeEach(() => {
    ajv = createCustomSchemaValidator();
  });

  describe('Format: json', () => {
    it('should validate valid JSON string', () => {
      const schema = { type: 'string', format: 'json' };
      const validate = ajv.compile(schema);
      
      expect(validate('{"key": "value"}')).toBe(true);
      expect(validate('[]')).toBe(true);
      expect(validate('123')).toBe(true);
      expect(validate('"string"')).toBe(true);
    });

    it('should reject invalid JSON string', () => {
      const schema = { type: 'string', format: 'json' };
      const validate = ajv.compile(schema);
      
      expect(validate('{invalid json}')).toBe(false);
      expect(validate('{"incomplete":')).toBe(false);
    });
  });

  describe('Format: html', () => {
    it('should validate HTML string', () => {
      const schema = { type: 'string', format: 'html' };
      const validate = ajv.compile(schema);
      
      expect(validate('<p>Hello</p>')).toBe(true);
      expect(validate('<div>World</div>')).toBe(true);
      expect(validate('<a href="#">Link</a>')).toBe(true);
    });

    it('should reject non-HTML string', () => {
      const schema = { type: 'string', format: 'html' };
      const validate = ajv.compile(schema);
      
      expect(validate('Just plain text')).toBe(false);
      expect(validate('No tags here')).toBe(false);
    });
  });

  describe('Format: text', () => {
    it('should validate text strings including multiline', () => {
      const schema = { type: 'string', format: 'text' };
      const validate = ajv.compile(schema);
      
      expect(validate('Single line')).toBe(true);
      expect(validate('Multi\nline\ntext')).toBe(true);
      expect(validate('')).toBe(true);
    });
  });

  describe('Property-level required', () => {
    it('should reject empty string when required is true', () => {
      const schema = { type: 'string', required: true };
      const validate = ajv.compile(schema);
      
      expect(validate('')).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors?.[0]?.keyword).toBe('required');
    });

    it('should accept non-empty string when required is true', () => {
      const schema = { type: 'string', required: true };
      const validate = ajv.compile(schema);
      
      expect(validate('not empty')).toBe(true);
      expect(validate(' ')).toBe(true);
    });

    it('should accept empty string when required is false', () => {
      const schema = { type: 'string', required: false };
      const validate = ajv.compile(schema);
      
      expect(validate('')).toBe(true);
    });

    it('should validate object with required array (object-level required)', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['name']
      };
      const validate = ajv.compile(schema);
      
      expect(validate({ name: 'John' })).toBe(true);
      expect(validate({ email: 'john@example.com' })).toBe(false);
      expect(validate.errors?.[0]?.keyword).toBe('required');
    });
  });

  describe('Precision keyword', () => {
    it('should validate number with correct precision', () => {
      const schema = { type: 'number', precision: 2 };
      const validate = ajv.compile(schema);
      
      expect(validate(10)).toBe(true);
      expect(validate(10.5)).toBe(true);
      expect(validate(10.55)).toBe(true);
    });

    it('should reject number with too many decimal places', () => {
      const schema = { type: 'number', precision: 2 };
      const validate = ajv.compile(schema);
      
      expect(validate(10.555)).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors?.[0]?.keyword).toBe('precision');
    });

    it('should validate integer with precision 0', () => {
      const schema = { type: 'number', precision: 0 };
      const validate = ajv.compile(schema);
      
      expect(validate(10)).toBe(true);
      expect(validate(0)).toBe(true);
      expect(validate(-5)).toBe(true);
    });

    it('should reject decimal with precision 0', () => {
      const schema = { type: 'number', precision: 0 };
      const validate = ajv.compile(schema);
      
      expect(validate(10.5)).toBe(false);
    });

    it('should handle precision values between 0 and 4', () => {
      for (let precision = 0; precision <= 4; precision++) {
        const schema = { type: 'number', precision };
        const validate = ajv.compile(schema);
        
        const validNumber = parseFloat('10.' + '5'.repeat(precision));
        expect(validate(validNumber)).toBe(true);
        
        if (precision < 4) {
          const invalidNumber = parseFloat('10.' + '5'.repeat(precision + 1));
          expect(validate(invalidNumber)).toBe(false);
        }
      }
    });
  });

  describe('Type inference with preprocessSchema', () => {
    it('should add type string when format is provided without type', () => {
      const schema = { format: 'json' };
      const processed = preprocessSchema(schema);
      
      expect(processed.type).toBe('string');
      expect(processed.format).toBe('json');
    });

    it('should not override existing type', () => {
      const schema = { type: 'number', format: 'json' };
      const processed = preprocessSchema(schema);
      
      expect(processed.type).toBe('number');
    });

    it('should process nested properties', () => {
      const schema = {
        type: 'object',
        properties: {
          data: { format: 'json' }
        }
      };
      const processed = preprocessSchema(schema);
      
      expect(processed.properties?.data).toBeDefined();
      expect((processed.properties?.data as any).type).toBe('string');
    });

    it('should process array items', () => {
      const schema = {
        type: 'array',
        items: { format: 'html' }
      };
      const processed = preprocessSchema(schema);
      
      expect((processed.items as any).type).toBe('string');
    });
  });
});
