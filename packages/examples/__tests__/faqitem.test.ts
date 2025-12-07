/**
 * Tests for FAQ Item schema validation
 * These tests verify that FAQ data correctly validates against the FAQ schema
 */
import { validateFaqItem } from '../validators';
import { validateSchema } from 'sem-schema';
import faqItemSchema from '../schemas/faqitem.schema.json';

describe('FAQ Item Schema Tests', () => {
  it('faqitem.schema.json should be a valid schema', () => {
    const result = validateSchema(faqItemSchema as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toBeNull();
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

    expect(validateFaqItem(validFaqItem).valid).toBe(true);
  });

  it('should reject FAQ without required fields', () => {
    const invalidFaqItem = {
      question: 'What is this?'
    };

    expect(validateFaqItem(invalidFaqItem).valid).toBe(false);
  });

  it('should reject FAQ with empty required question', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: '',
      answer: '<p>Answer</p>'
    };

    const result = validateFaqItem(invalidFaqItem);
    expect(result.valid).toBe(false);
    const hasRequiredError = result.errors?.some(
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

    const result = validateFaqItem(invalidFaqItem);
    expect(result.valid).toBe(false);
    const hasFormatError = result.errors?.some(
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

    expect(validateFaqItem(invalidFaqItem).valid).toBe(false);
  });

  it('should reject FAQ with invalid helpfulness precision', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      helpfulness: 0.999 // Too many decimal places
    };

    const result = validateFaqItem(invalidFaqItem);
    expect(result.valid).toBe(false);
    const hasPrecisionError = result.errors?.some(
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

    expect(validateFaqItem(validFaqItem).valid).toBe(true);
  });

  it('should reject FAQ with invalid JSON metadata', () => {
    const invalidFaqItem = {
      id: 'faq-1',
      question: 'What is this?',
      answer: '<p>Answer</p>',
      metadata: '{invalid}'
    };

    expect(validateFaqItem(invalidFaqItem).valid).toBe(false);
  });
});
