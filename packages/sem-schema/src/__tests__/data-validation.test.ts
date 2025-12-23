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

  describe('inputMode: required validation', () => {
    it('should reject empty string when inputMode is required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', inputMode: 'required' }
        }
      };
      
      const result = validateData({ name: '' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('inputMode');
      expect(result.errors?.[0]?.message).toContain('must not be empty');
    });

    it('should reject null when inputMode is required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: ['string', 'null'], inputMode: 'required' }
        }
      };
      
      const result = validateData({ name: null }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('inputMode');
      expect(result.errors?.[0]?.message).toContain('must not be null or undefined');
    });

    it('should reject undefined when inputMode is required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', inputMode: 'required' }
        }
      };
      
      const result = validateData({}, schema);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.keyword).toBe('inputMode');
    });

    it('should accept non-empty string when inputMode is required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', inputMode: 'required' }
        }
      };
      
      expect(validateData({ name: 'not empty' }, schema).valid).toBe(true);
      expect(validateData({ name: ' ' }, schema).valid).toBe(true);
    });

    it('should reject empty string with any format when inputMode is required', () => {
      const schema = {
        type: 'object',
        properties: {
          jsonField: { type: 'string', format: 'json', inputMode: 'required' },
          htmlField: { type: 'string', format: 'html', inputMode: 'required' },
          textField: { type: 'string', format: 'text', inputMode: 'required' }
        }
      };
      
      expect(validateData({ jsonField: '', htmlField: '', textField: '' }, schema).valid).toBe(false);
      
      const jsonResult = validateData({ jsonField: '', htmlField: '<p>ok</p>', textField: 'ok' }, schema);
      expect(jsonResult.valid).toBe(false);
      
      const htmlResult = validateData({ jsonField: '{}', htmlField: '', textField: 'ok' }, schema);
      expect(htmlResult.valid).toBe(false);
      
      const textResult = validateData({ jsonField: '{}', htmlField: '<p>ok</p>', textField: '' }, schema);
      expect(textResult.valid).toBe(false);
    });

    it('should accept empty string when inputMode is not required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', inputMode: 'default' }
        }
      };
      
      expect(validateData({ name: '' }, schema).valid).toBe(true);
    });

    it('should validate multiple fields with inputMode required', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', inputMode: 'required' },
          email: { type: 'string', format: 'email', inputMode: 'required' },
          notes: { type: 'string' }
        }
      };
      
      // All required fields filled - valid
      expect(validateData({ 
        name: 'John', 
        email: 'john@example.com',
        notes: 'Some notes'
      }, schema).valid).toBe(true);
      
      // Missing required name - invalid
      const result1 = validateData({ 
        email: 'john@example.com',
        notes: 'Some notes'
      }, schema);
      expect(result1.valid).toBe(false);
      expect(result1.errors?.some((e: any) => e.keyword === 'inputMode')).toBe(true);
      
      // Empty required email - invalid
      const result2 = validateData({ 
        name: 'John',
        email: '',
        notes: 'Some notes'
      }, schema);
      expect(result2.valid).toBe(false);
      expect(result2.errors?.some((e: any) => e.keyword === 'inputMode')).toBe(true);
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

  describe('Standard Formats - iri (implemented by us)', () => {
    it('should validate valid IRIs', () => {
      const schema = { type: 'string', format: 'iri' };
      
      expect(validateData('https://example.com', schema).valid).toBe(true);
      expect(validateData('http://例え.jp', schema).valid).toBe(true);
    });

    it('should reject invalid IRIs', () => {
      const schema = { type: 'string', format: 'iri' };
      
      expect(validateData('not an iri', schema).valid).toBe(false);
      expect(validateData('', schema).valid).toBe(false);
    });
  });

  describe('Standard Formats - iri-reference (implemented by us)', () => {
    it('should validate valid IRI references', () => {
      const schema = { type: 'string', format: 'iri-reference' };
      
      expect(validateData('https://example.com', schema).valid).toBe(true);
      expect(validateData('/path/to/resource', schema).valid).toBe(true);
      expect(validateData('../relative', schema).valid).toBe(true);
      expect(validateData('#fragment', schema).valid).toBe(true);
    });

    it('should reject invalid IRI references', () => {
      const schema = { type: 'string', format: 'iri-reference' };
      
      expect(validateData('has spaces', schema).valid).toBe(false);
      expect(validateData('has<brackets>', schema).valid).toBe(false);
    });
  });

  describe('Standard Formats - idn-email (implemented by us)', () => {
    it('should validate valid IDN emails', () => {
      const schema = { type: 'string', format: 'idn-email' };
      
      expect(validateData('user@example.com', schema).valid).toBe(true);
      expect(validateData('用户@例え.jp', schema).valid).toBe(true);
    });

    it('should reject invalid IDN emails', () => {
      const schema = { type: 'string', format: 'idn-email' };
      
      expect(validateData('not-an-email', schema).valid).toBe(false);
      expect(validateData('@nodomain', schema).valid).toBe(false);
      expect(validateData('user@', schema).valid).toBe(false);
    });
  });

  describe('Standard Formats - idn-hostname (implemented by us)', () => {
    it('should validate valid IDN hostnames', () => {
      const schema = { type: 'string', format: 'idn-hostname' };
      
      expect(validateData('example.com', schema).valid).toBe(true);
      expect(validateData('例え.jp', schema).valid).toBe(true);
      expect(validateData('subdomain.example.com', schema).valid).toBe(true);
    });

    it('should reject invalid IDN hostnames', () => {
      const schema = { type: 'string', format: 'idn-hostname' };
      
      expect(validateData('.starts-with-dot', schema).valid).toBe(false);
      expect(validateData('ends-with-dot.', schema).valid).toBe(false);
      expect(validateData('-starts-with-dash', schema).valid).toBe(false);
    });
  });

  describe('Standard JSON Schema required array (object-level)', () => {
    it('should reject missing property when in required array', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['name']
      };
      
      // Missing required 'name' property - should fail
      const result = validateData({ email: 'john@example.com' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors?.[0]?.keyword).toBe('required');
    });

    it('should accept empty string for property in required array (standard behavior)', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
      };
      
      // Property exists but is empty string - should pass (standard JSON Schema)
      const result = validateData({ name: '' }, schema);
      expect(result.valid).toBe(true);
    });

    it('should accept property with value when in required array', () => {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['name']
      };
      
      expect(validateData({ name: 'John' }, schema).valid).toBe(true);
      expect(validateData({ name: 'John', email: 'john@example.com' }, schema).valid).toBe(true);
    });

    it('should differentiate between required array and inputMode required', () => {
      const schema = {
        type: 'object',
        properties: {
          // Standard required: property must exist, but empty string is OK
          field1: { type: 'string' },
          // inputMode required: property must have non-empty value
          field2: { type: 'string', inputMode: 'required' }
        },
        required: ['field1']
      };
      
      // field1 with empty string - valid (required array allows empty)
      expect(validateData({ field1: '', field2: 'value' }, schema).valid).toBe(true);
      
      // field1 missing - invalid (required array)
      expect(validateData({ field2: 'value' }, schema).valid).toBe(false);
      
      // field2 with empty string - invalid (inputMode: required)
      const result = validateData({ field1: 'value', field2: '' }, schema);
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e: any) => e.keyword === 'inputMode')).toBe(true);
    });
  });

});
