import { Product } from '../generated/product';
import { FAQItem } from '../generated/faqitem';

describe('Generated Types', () => {
  describe('Product Type', () => {
    it('should allow valid product object', () => {
      const product: Product = {
        id: 'prod-123',
        name: 'Test Product',
        price: 99.99,
        stock: 50,
        rating: 4.5,
        tags: ['electronics', 'gadget']
      };

      expect(product.id).toBe('prod-123');
      expect(product.name).toBe('Test Product');
    });

    it('should require id and name fields', () => {
      // This should cause TypeScript compilation errors if uncommented:
      // const invalidProduct: Product = {
      //   price: 99.99
      // };
      
      // Type check passes if required fields are present
      const validProduct: Product = {
        id: 'prod-123',
        name: 'Test Product'
      };
      
      expect(validProduct).toBeDefined();
    });

    it('should allow optional fields', () => {
      const productWithOptional: Product = {
        id: 'prod-123',
        name: 'Test Product',
        description: { text: 'A description' },
        price: 99.99
      };

      expect(productWithOptional.description).toBeDefined();
    });
  });

  describe('FAQItem Type', () => {
    it('should allow valid FAQ item object', () => {
      const faqItem: FAQItem = {
        id: 'faq-1',
        question: 'What is this?',
        answer: { html: '<p>Answer</p>' },
        views: 100,
        helpfulness: 0.95,
        tags: ['general']
      };

      expect(faqItem.id).toBe('faq-1');
      expect(faqItem.question).toBe('What is this?');
    });

    it('should require id, question, and answer fields', () => {
      const validFaqItem: FAQItem = {
        id: 'faq-1',
        question: 'What is this?',
        answer: { html: '<p>Answer</p>' }
      };

      expect(validFaqItem).toBeDefined();
    });

    it('should allow optional fields', () => {
      const faqItemWithOptional: FAQItem = {
        id: 'faq-1',
        question: 'What is this?',
        answer: { html: '<p>Answer</p>' },
        category: { text: 'General' },
        views: 100
      };

      expect(faqItemWithOptional.category).toBeDefined();
    });
  });
});
