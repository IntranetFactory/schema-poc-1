import { createAjvInstance, preprocessSchema } from '../validators/custom-keywords';
import { SchemaObject } from 'ajv';

describe('Custom Keywords', () => {
  let ajv: ReturnType<typeof createAjvInstance>;

  beforeEach(() => {
    ajv = createAjvInstance();
  });

  describe('Custom format: json', () => {
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

  describe('Custom format: html', () => {
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

  describe('Custom format: text', () => {
    it('should validate text strings including multiline', () => {
      const schema = { type: 'string', format: 'text' };
      const validate = ajv.compile(schema);
      
      expect(validate('Single line')).toBe(true);
      expect(validate('Multi\nline\ntext')).toBe(true);
      expect(validate('')).toBe(true);
    });
  });

  describe('Custom keyword: requiredProperty', () => {
    it('should reject empty string when requiredProperty is true', () => {
      const schema = { type: 'string', requiredProperty: true };
      const validate = ajv.compile(schema);
      
      expect(validate('')).toBe(false);
      expect(validate.errors).toBeDefined();
      expect(validate.errors?.[0]?.keyword).toBe('requiredProperty');
    });

    it('should accept non-empty string when requiredProperty is true', () => {
      const schema = { type: 'string', requiredProperty: true };
      const validate = ajv.compile(schema);
      
      expect(validate('not empty')).toBe(true);
      expect(validate(' ')).toBe(true);
    });

    it('should accept empty string when requiredProperty is false', () => {
      const schema = { type: 'string', requiredProperty: false };
      const validate = ajv.compile(schema);
      
      expect(validate('')).toBe(true);
    });
  });

  describe('Custom keyword: precision', () => {
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

  describe('preprocessSchema', () => {
    it('should add type string when format is provided without type', () => {
      const schema: SchemaObject = { format: 'json' };
      const processed = preprocessSchema(schema);
      
      expect(processed.type).toBe('string');
      expect(processed.format).toBe('json');
    });

    it('should not override existing type', () => {
      const schema: SchemaObject = { type: 'number', format: 'json' };
      const processed = preprocessSchema(schema);
      
      expect(processed.type).toBe('number');
    });

    it('should process nested properties', () => {
      const schema: SchemaObject = {
        type: 'object',
        properties: {
          field1: { format: 'json' },
          field2: { type: 'string' }
        }
      };
      const processed = preprocessSchema(schema);
      
      expect((processed.properties as any).field1.type).toBe('string');
      expect((processed.properties as any).field2.type).toBe('string');
    });

    it('should process array items', () => {
      const schema: SchemaObject = {
        type: 'array',
        items: { format: 'html' }
      };
      const processed = preprocessSchema(schema);
      
      expect((processed.items as SchemaObject).type).toBe('string');
    });
  });
});
