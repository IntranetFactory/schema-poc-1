/**
 * Tests for Product schema validation
 * These tests verify that product data correctly validates against the product schema
 */
import { validateProduct } from '../validators';
import productSchema from '../schemas/product.schema.json';
import { createSemSchemaValidator, preprocessSchema } from 'sem-schema';

describe('Product Schema Tests', () => {
  let ajv: ReturnType<typeof createSemSchemaValidator>;

  beforeEach(() => {
    ajv = createSemSchemaValidator();
  });

  it('product.schema.json should be a valid schema after preprocessing', () => {
    const processed = preprocessSchema(productSchema as any);
    expect(() => ajv.compile(processed)).not.toThrow();
  });

  it('should validate valid product', () => {
    const validProduct = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'A test product\nwith multiple lines',
      detailedDescription: '<p>Detailed description</p>',
      metadata: '{"category": "electronics"}',
      price: 99.99,
      stock: 50,
      rating: 4.5,
      tags: ['electronics', 'gadget']
    };

    expect(validateProduct(validProduct)).toBe(true);
  });

  it('should reject product with empty required field', () => {
    const invalidProduct = {
      id: '',
      name: 'Test Product'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
    expect(validateProduct.errors).toBeDefined();
    const hasRequiredError = validateProduct.errors?.some(
      err => err.keyword === 'required'
    );
    expect(hasRequiredError).toBe(true);
  });

  it('should reject product without required id', () => {
    const invalidProduct = {
      name: 'Test Product'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should reject product without required name', () => {
    const invalidProduct = {
      id: 'prod-123'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should reject product with invalid price precision', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      price: 99.999 // Too many decimal places
    };

    expect(validateProduct(invalidProduct)).toBe(false);
    const hasPrecisionError = validateProduct.errors?.some(
      err => err.keyword === 'precision'
    );
    expect(hasPrecisionError).toBe(true);
  });

  it('should reject product with invalid JSON format', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      metadata: '{not valid json}'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
    const hasFormatError = validateProduct.errors?.some(
      err => err.keyword === 'format'
    );
    expect(hasFormatError).toBe(true);
  });

  it('should reject product with non-HTML detailedDescription', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      detailedDescription: 'Plain text without tags'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
    const hasFormatError = validateProduct.errors?.some(
      err => err.keyword === 'format'
    );
    expect(hasFormatError).toBe(true);
  });

  it('should accept product with valid text format description', () => {
    const validProduct = {
      id: 'prod-123',
      name: 'Test Product',
      description: 'Multi\nline\ntext'
    };

    expect(validateProduct(validProduct)).toBe(true);
  });
});
