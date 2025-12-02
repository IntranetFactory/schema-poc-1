import { validateProduct, validateFaqItem } from '../validators';

describe('Product Validator', () => {
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
      err => err.keyword === 'requiredProperty'
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
      price: 99.999
    };

    expect(validateProduct(invalidProduct)).toBe(false);
    const hasPrecisionError = validateProduct.errors?.some(
      err => err.keyword === 'precision'
    );
    expect(hasPrecisionError).toBe(true);
  });

  it('should reject product with decimal stock', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      stock: 50.5
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should reject product with invalid rating precision', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      rating: 4.55
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should reject product with invalid JSON metadata', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      metadata: '{invalid json}'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should reject product with non-HTML detailedDescription', () => {
    const invalidProduct = {
      id: 'prod-123',
      name: 'Test Product',
      detailedDescription: 'Plain text without tags'
    };

    expect(validateProduct(invalidProduct)).toBe(false);
  });

  it('should accept product with only required fields', () => {
    const minimalProduct = {
      id: 'prod-123',
      name: 'Test Product'
    };

    expect(validateProduct(minimalProduct)).toBe(true);
  });
});

describe('FAQItem Validator', () => {
  it('should validate valid FAQ item', () => {
    const validFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>This is the answer</p>',
      category: 'General',
      metadata: '{"priority": 1}',
      views: 100,
      helpfulness: 0.95,
      tags: ['general', 'intro']
    };

    expect(validateFaqItem(validFaqItem)).toBe(true);
  });

  it('should reject FAQ with empty required question', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: '',
      answer: '<p>Answer</p>'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
    const hasRequiredError = validateFaqItem.errors?.some(
      err => err.keyword === 'requiredProperty'
    );
    expect(hasRequiredError).toBe(true);
  });

  it('should reject FAQ with empty required answer', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: ''
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ without required id', () => {
    const invalidFaqItem = {
      question: 'Question?',
      answer: '<p>Answer</p>'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with non-HTML answer', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: 'Plain text answer'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with decimal views', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: '<p>Answer</p>',
      views: 100.5
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with invalid helpfulness precision', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: '<p>Answer</p>',
      helpfulness: 0.955
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with invalid JSON metadata', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: '<p>Answer</p>',
      metadata: 'not json'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should accept FAQ with only required fields', () => {
    const minimalFaqItem = {
      id: 'faq-1',
      question: 'Question?',
      answer: '<p>Answer</p>'
    };

    expect(validateFaqItem(minimalFaqItem)).toBe(true);
  });
});
