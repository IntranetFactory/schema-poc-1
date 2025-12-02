/**
 * Tests for FAQ Item schema validation
 * These tests verify that FAQ data correctly validates against the FAQ schema
 */
import { validateFaqItem } from '../validators';
import faqItemSchema from '../schemas/faqitem.schema.json';
import { createCustomSchemaValidator, preprocessSchema } from 'sem-schema';

describe('FAQ Item Schema Tests', () => {
  let ajv: ReturnType<typeof createCustomSchemaValidator>;

  beforeEach(() => {
    ajv = createCustomSchemaValidator();
  });

  it('faqitem.schema.json should be a valid schema after preprocessing', () => {
    const processed = preprocessSchema(faqItemSchema as any);
    expect(() => ajv.compile(processed)).not.toThrow();
  });

  it('should validate valid FAQ item', () => {
    const validFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>This is an answer</p>',
      category: 'General',
      metadata: '{"priority": 1}',
      views: 100,
      helpfulness: 0.95,
      tags: ['general', 'basic']
    };

    expect(validateFaqItem(validFaqItem)).toBe(true);
  });

  it('should reject FAQ without required fields', () => {
    const invalidFaqItem = {
      question: 'What is this?'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with empty required question', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: '',
      answer: '<p>Answer</p>'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
    const hasRequiredError = validateFaqItem.errors?.some(
      err => err.keyword === 'required'
    );
    expect(hasRequiredError).toBe(true);
  });

  it('should reject FAQ with non-HTML answer', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: 'Plain text answer'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
    const hasFormatError = validateFaqItem.errors?.some(
      err => err.keyword === 'format'
    );
    expect(hasFormatError).toBe(true);
  });

  it('should reject FAQ with invalid views precision', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      views: 100.5 // Should be integer
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });

  it('should reject FAQ with invalid helpfulness precision', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      helpfulness: 0.999 // Too many decimal places
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
    const hasPrecisionError = validateFaqItem.errors?.some(
      err => err.keyword === 'precision'
    );
    expect(hasPrecisionError).toBe(true);
  });

  it('should accept FAQ with valid metadata', () => {
    const validFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      metadata: '{"key": "value"}'
    };

    expect(validateFaqItem(validFaqItem)).toBe(true);
  });

  it('should reject FAQ with invalid JSON metadata', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      metadata: '{invalid}'
    };

    expect(validateFaqItem(invalidFaqItem)).toBe(false);
  });
});
