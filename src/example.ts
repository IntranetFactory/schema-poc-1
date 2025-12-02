import { validateProduct, validateFaqItem } from './custom-schema';

console.log('=== Custom JSON Schema Vocabulary Demo ===\n');

// Example 1: Valid Product
console.log('1. Validating a VALID product:');
const validProduct = {
  id: 'prod-123',
  name: 'Wireless Headphones',
  description: 'Premium wireless headphones\nwith noise cancellation\nand 30-hour battery life',
  detailedDescription: '<div><h2>Features</h2><ul><li>Active Noise Cancellation</li><li>30-hour battery</li></ul></div>',
  metadata: '{"brand": "TechCo", "model": "WH-1000", "year": 2024}',
  price: 299.99,
  stock: 150,
  rating: 4.5,
  tags: ['electronics', 'audio', 'wireless']
};

if (validateProduct(validProduct)) {
  console.log('✓ Product is valid!\n');
} else {
  console.log('✗ Validation failed:', validateProduct.errors, '\n');
}

// Example 2: Invalid Product - empty required field
console.log('2. Validating an INVALID product (empty required field):');
const invalidProduct1 = {
  id: '',  // Empty string violates requiredProperty
  name: 'Test Product'
};

if (validateProduct(invalidProduct1)) {
  console.log('✓ Product is valid!\n');
} else {
  console.log('✗ Validation failed:');
  validateProduct.errors?.forEach(err => {
    console.log(`  - ${err.instancePath || '/'}: ${err.message} (${err.keyword})`);
  });
  console.log();
}

// Example 3: Invalid Product - too many decimal places
console.log('3. Validating an INVALID product (precision violation):');
const invalidProduct2 = {
  id: 'prod-456',
  name: 'Test Product',
  price: 99.999  // Too many decimal places (precision: 2)
};

if (validateProduct(invalidProduct2)) {
  console.log('✓ Product is valid!\n');
} else {
  console.log('✗ Validation failed:');
  validateProduct.errors?.forEach(err => {
    console.log(`  - ${err.instancePath || '/'}: ${err.message} (${err.keyword})`);
  });
  console.log();
}

// Example 4: Invalid Product - invalid JSON format
console.log('4. Validating an INVALID product (invalid JSON format):');
const invalidProduct3 = {
  id: 'prod-789',
  name: 'Test Product',
  metadata: '{not valid json}'  // Invalid JSON
};

if (validateProduct(invalidProduct3)) {
  console.log('✓ Product is valid!\n');
} else {
  console.log('✗ Validation failed:');
  validateProduct.errors?.forEach(err => {
    console.log(`  - ${err.instancePath || '/'}: ${err.message} (${err.keyword})`);
  });
  console.log();
}

// Example 5: Invalid Product - non-HTML string
console.log('5. Validating an INVALID product (non-HTML format):');
const invalidProduct4 = {
  id: 'prod-999',
  name: 'Test Product',
  detailedDescription: 'This is just plain text without HTML tags'
};

if (validateProduct(invalidProduct4)) {
  console.log('✓ Product is valid!\n');
} else {
  console.log('✗ Validation failed:');
  validateProduct.errors?.forEach(err => {
    console.log(`  - ${err.instancePath || '/'}: ${err.message} (${err.keyword})`);
  });
  console.log();
}

// Example 6: Valid FAQ Item
console.log('6. Validating a VALID FAQ item:');
const validFaqItem = {
  id: 'faq-1',
  question: 'How do I reset my password?',
  answer: '<p>To reset your password, click on the "Forgot Password" link on the login page.</p>',
  category: 'Account Management',
  metadata: '{"priority": 1, "tags": ["account", "security"]}',
  views: 1250,
  helpfulness: 0.87,
  tags: ['account', 'password', 'security']
};

if (validateFaqItem(validFaqItem)) {
  console.log('✓ FAQ item is valid!\n');
} else {
  console.log('✗ Validation failed:', validateFaqItem.errors, '\n');
}

// Example 7: Invalid FAQ - empty required field
console.log('7. Validating an INVALID FAQ item (empty answer):');
const invalidFaqItem = {
  id: 'faq-2',
  question: 'What is the return policy?',
  answer: ''  // Empty string violates requiredProperty
};

if (validateFaqItem(invalidFaqItem)) {
  console.log('✓ FAQ item is valid!\n');
} else {
  console.log('✗ Validation failed:');
  validateFaqItem.errors?.forEach(err => {
    console.log(`  - ${err.instancePath || '/'}: ${err.message} (${err.keyword})`);
  });
  console.log();
}

console.log('=== Demo Complete ===');
