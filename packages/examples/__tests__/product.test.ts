/**
 * Tests for Product schema validation
 * These tests verify that product data correctly validates against the product schema
 */
import { validateProduct } from '../validators';
import { validateSchema } from 'sem-schema';
import productSchema from '../schemas/product.schema.json';

describe('Product Schema Tests', () => {
  it('product.schema.json should be a valid schema', () => {
    expect(validateSchema(productSchema as any)).toBe(true);
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

    expect(validateProduct(validProduct).valid).toBe(true);
  });

  it('should reject product with empty required field', () => {
    const invalidProduct = {
      id: '',
      name: 'Test Product'
    };

    const result = validateProduct(invalidProduct);
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    const hasRequiredError = result.errors?.some(
      err => err.keyword === 'required'
    );
    expect(hasRequiredError).toBe(true);
  });

  it('should reject product without required id', () => {
    const invalidProduct = {
      name: 'Test Product'
    };

    expect(validateProduct(invalidProduct).valid).toBe(false);
  });

  it('should reject product without required name', () => {
    const invalidProduct = {
      id: 'prod-123'
    };

    expect(validateProduct(invalidProduct).valid).toBe(false);
  });

  it('should reject product with invalid price precision', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      price: 99.999 // Too many decimal places
    };

    const result = validateProduct(invalidProduct);
    expect(result.valid).toBe(false);
    const hasPrecisionError = result.errors?.some(
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

    const result = validateProduct(invalidProduct);
    expect(result.valid).toBe(false);
    const hasFormatError = result.errors?.some(
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

    const result = validateProduct(invalidProduct);
    expect(result.valid).toBe(false);
    const hasFormatError = result.errors?.some(
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

    expect(validateProduct(validProduct).valid).toBe(true);
  });
});
