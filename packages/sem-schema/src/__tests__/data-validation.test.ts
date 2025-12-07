/**
 * Tests for data validation using SemSchema vocabulary
 * These tests verify that data correctly validates against schemas using custom keywords
 */
import { validateData } from '../api';

describe('Data Validation Tests', () => {
  describe('Format: json', () => {
    it('should validate valid JSON string', () => {
      const schema = { type: 'string', format: 'json' };
      
      expect(validateData('{"key": "value"}', schema).valid).toBe(true);
      expect(validateData('[]', schema).valid).toBe(true);
      expect(validateData('123', schema).valid).toBe(true);
      expect(validateData('"string"', schema).valid).toBe(true);
    });

    it('should reject invalid JSON string', () => {
      const schema = { type: 'string', format: 'json' };
      
      expect(validateData('{invalid json}', schema).valid).toBe(false);
      expect(validateData('{"incomplete":', schema).valid).toBe(false);
    });
  });

  describe('Format: html', () => {
    it('should validate HTML string', () => {
      const schema = { type: 'string', format: 'html' };
      
      expect(validateData('<p>Hello</p>', schema).valid).toBe(true);
      expect(validateData('<div>World</div>', schema).valid).toBe(true);
      expect(validateData('<a href="#">Link</a>', schema).valid).toBe(true);
    });

    it('should reject non-HTML string', () => {
      const schema = { type: 'string', format: 'html' };
      
      expect(validateData('Just plain text', schema).valid).toBe(false);
      expect(validateData('No tags here', schema).valid).toBe(false);
    });
  });

  describe('Format: text', () => {
    it('should validate text strings including multiline', () => {
      const schema = { type: 'string', format: 'text' };
      
      expect(validateData('Single line', schema).valid).toBe(true);
      expect(validateData('Multi\nline\ntext', schema).valid).toBe(true);
      expect(validateData('', schema).valid).toBe(true);
    });
  });

  describe('Property-level required', () => {
    it('should reject empty string when required is true', () => {
      const schema = { type: 'string', required: true };
      
      const result = validateData('', schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('required');
    });

    it('should reject null when required is true', () => {
      const schema = { type: ['string', 'null'], required: true };
      
      const result = validateData(null, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('required');
    });

    it('should accept non-empty string when required is true', () => {
      const schema = { type: 'string', required: true };
      
      expect(validateData('not empty', schema).valid).toBe(true);
      expect(validateData(' ', schema).valid).toBe(true);
    });

    it('should reject empty string with any format when required is true', () => {
      // Empty strings are invalid for json/html formats (fail format validation)
      // Empty strings with text format fail required validation
      const jsonSchema = { type: 'string', format: 'json', required: true };
      const htmlSchema = { type: 'string', format: 'html', required: true };
      const textSchema = { type: 'string', format: 'text', required: true };
      
      expect(validateData('', jsonSchema).valid).toBe(false);
      expect(validateData('', htmlSchema).valid).toBe(false);
      
      const textResult = validateData('', textSchema);
      expect(textResult.valid).toBe(false);
      expect(textResult.errors?.[0]?.keyword).toBe('required');
    });

    it('should accept empty string when required is false', () => {
      const schema = { type: 'string', required: false };
      
      expect(validateData('', schema).valid).toBe(true);
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
      
      expect(validateData({ name: 'John' }, schema).valid).toBe(true);
      
      const result = validateData({ email: 'john@example.com' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]?.keyword).toBe('required');
    });
  });

  describe('Precision keyword', () => {
    it('should validate number with correct precision', () => {
      const schema = { type: 'number', precision: 2 };
      
      expect(validateData(10, schema).valid).toBe(true);
      expect(validateData(10.5, schema).valid).toBe(true);
      expect(validateData(10.55, schema).valid).toBe(true);
    });

    it('should reject number with too many decimal places', () => {
      const schema = { type: 'number', precision: 2 };
      
      const result = validateData(10.555, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('precision');
    });

    it('should validate integer with precision 0', () => {
      const schema = { type: 'number', precision: 0 };
      
      expect(validateData(10, schema).valid).toBe(true);
      expect(validateData(0, schema).valid).toBe(true);
      expect(validateData(-5, schema).valid).toBe(true);
    });

    it('should reject decimal with precision 0', () => {
      const schema = { type: 'number', precision: 0 };
      
      expect(validateData(10.5, schema).valid).toBe(false);
    });

    it('should handle precision values between 0 and 4', () => {
      for (let precision = 0; precision <= 4; precision++) {
        const schema = { type: 'number', precision };
        
        const validNumber = parseFloat('10.' + '5'.repeat(precision));
        expect(validateData(validNumber, schema).valid).toBe(true);
        
        if (precision < 4) {
          const invalidNumber = parseFloat('10.' + '5'.repeat(precision + 1));
          expect(validateData(invalidNumber, schema).valid).toBe(false);
        }
      }
    });
  });

  describe('Type inference', () => {
    it('should infer type string when format is provided without type', () => {
      const schema = { format: 'json' };
      
      expect(validateData('{"key": "value"}', schema).valid).toBe(true);
    });

    it('should validate nested properties with inferred types', () => {
      const schema = {
        type: 'object',
        properties: {
          data: { format: 'json' }  // Type inferred as string
        }
      };
      
      expect(validateData({ data: '{"key": "value"}' }, schema).valid).toBe(true);
    });

    it('should validate array items with inferred types', () => {
      const schema = {
        type: 'array',
        items: { format: 'html' }  // Type inferred as string
      };
      
      expect(validateData(['<p>Item 1</p>', '<p>Item 2</p>'], schema).valid).toBe(true);
    });
  });

  describe('Standard Formats - email', () => {
    it('should validate valid email addresses', () => {
      const schema = { type: 'string', format: 'email' };
      
      expect(validateData('user@example.com', schema).valid).toBe(true);
      expect(validateData('john.doe@company.co.uk', schema).valid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      const schema = { type: 'string', format: 'email' };
      
      expect(validateData('not-an-email', schema).valid).toBe(false);
      expect(validateData('missing@domain', schema).valid).toBe(false);
    });
  });

  describe('Standard Formats - date', () => {
    it('should validate valid dates', () => {
      const schema = { type: 'string', format: 'date' };
      
      expect(validateData('2023-12-07', schema).valid).toBe(true);
      expect(validateData('2024-01-01', schema).valid).toBe(true);
    });

    it('should reject invalid dates', () => {
      const schema = { type: 'string', format: 'date' };
      
      expect(validateData('2023-13-45', schema).valid).toBe(false);
      expect(validateData('not-a-date', schema).valid).toBe(false);
    });
  });

  describe('Standard Formats - uri', () => {
    it('should validate valid URIs', () => {
      const schema = { type: 'string', format: 'uri' };
      
      expect(validateData('https://example.com', schema).valid).toBe(true);
      expect(validateData('ftp://files.example.org', schema).valid).toBe(true);
    });

    it('should reject invalid URIs', () => {
      const schema = { type: 'string', format: 'uri' };
      
      expect(validateData('not a uri', schema).valid).toBe(false);
    });
  });

  describe('Unknown Formats - Data validation', () => {
    it('should reject data validation with unknown format', () => {
      const schema = { type: 'string', format: 'emailx' };
      
      expect(() => validateData('test@example.com', schema)).toThrow('Unknown format "emailx"');
    });
  });
});
