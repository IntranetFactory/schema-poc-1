# Custom JSON Schema Vocabulary POC

This project demonstrates a custom JSON Schema vocabulary implementation in TypeScript with AJV validation.

## Features

### Custom Vocabulary Extensions

1. **Custom String Formats**
   - `json`: Validates that a string contains valid JSON
   - `html`: Validates that a string contains HTML markup (checks for HTML tags)
   - `text`: Allows multiline text strings

2. **Property-Level Required Validation**
   - Custom keyword: `requiredProperty` (boolean)
   - When set to `true`, empty strings violate the constraint
   - Addresses JSON Schema's limitation where empty strings are considered valid

3. **Number Precision Validation**
   - Custom keyword: `precision` (integer, 0-4)
   - Validates the number of decimal places in a number
   - Example: `precision: 2` allows up to 2 decimal places (e.g., 99.99)
   - `precision: 0` requires integers only

4. **Default Type Inference**
   - When no `type` is provided but `format` is specified, defaults to `string` type
   - Allows schemas like `{ "format": "json" }` without explicitly declaring `type: "string"`

## Project Structure

```
schema-poc-1/
├── src/
│   ├── schemas/              # JSON Schema definitions
│   │   ├── product.schema.json
│   │   └── faqitem.schema.json
│   ├── validators/           # Validation logic
│   │   ├── custom-keywords.ts  # AJV custom keyword implementations
│   │   └── index.ts            # Validator exports
│   ├── generated/            # Auto-generated TypeScript types
│   │   ├── product.d.ts
│   │   └── faqitem.d.ts
│   ├── __tests__/            # Test files
│   │   ├── custom-keywords.test.ts
│   │   ├── validators.test.ts
│   │   └── generated-types.test.ts
│   └── index.ts              # Main exports
├── scripts/
│   └── generate-types.ts     # Build-time type generation script
└── dist/                     # Compiled JavaScript output
```

## Installation

```bash
npm install
```

## Usage

### Using the Validators

```typescript
import { validateProduct, validateFaqItem } from './validators';

// Validate a product
const product = {
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

if (validateProduct(product)) {
  console.log('Product is valid!');
} else {
  console.error('Validation errors:', validateProduct.errors);
}
```

### Creating Custom Validators

```typescript
import { createAjvInstance, preprocessSchema } from './validators/custom-keywords';

// Create an AJV instance with custom keywords
const ajv = createAjvInstance();

// Define your schema
const mySchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      requiredProperty: true  // Empty strings not allowed
    },
    config: {
      format: 'json'  // Must be valid JSON string
    },
    description: {
      format: 'html'  // Must contain HTML tags
    },
    price: {
      type: 'number',
      precision: 2  // Up to 2 decimal places
    }
  }
};

// Preprocess to handle default types
const processedSchema = preprocessSchema(mySchema);

// Compile the validator
const validate = ajv.compile(processedSchema);

// Use the validator
const data = {
  email: 'user@example.com',
  config: '{"key": "value"}',
  description: '<p>HTML content</p>',
  price: 99.99
};

if (validate(data)) {
  console.log('Valid!');
} else {
  console.log('Errors:', validate.errors);
}
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript (includes type generation)
- `npm run generate-types` - Generate TypeScript types from JSON schemas
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## Sample Schemas

### Product Schema

Demonstrates a product catalog entry with:
- Required string fields (`id`, `name`)
- Multiline text description
- HTML formatted detailed description
- JSON metadata
- Price with 2 decimal precision
- Integer stock quantity
- Rating with 1 decimal precision

### FAQ Item Schema

Demonstrates a FAQ entry with:
- Required string fields (`id`, `question`)
- Required HTML formatted answer
- Text category field
- JSON metadata
- Integer view count
- Helpfulness score with 2 decimal precision

## Testing

The project includes comprehensive tests for:

1. **Custom Keywords** (`custom-keywords.test.ts`)
   - Format validation (json, html, text)
   - Property-level required validation
   - Precision validation
   - Schema preprocessing

2. **Validators** (`validators.test.ts`)
   - Product validation with various valid and invalid inputs
   - FAQ item validation with various valid and invalid inputs

3. **Generated Types** (`generated-types.test.ts`)
   - TypeScript type checking for generated interfaces

Run tests with:
```bash
npm test
```

## Custom Keywords Reference

### `requiredProperty`

- **Type**: boolean
- **Applies to**: string
- **Description**: When `true`, validates that the string is not empty
- **Example**:
  ```json
  {
    "type": "string",
    "requiredProperty": true
  }
  ```

### `precision`

- **Type**: integer (0-4)
- **Applies to**: number
- **Description**: Validates the maximum number of decimal places
- **Example**:
  ```json
  {
    "type": "number",
    "precision": 2
  }
  ```

### Custom Formats

#### `json`
- Validates that the string contains valid JSON
- Example: `'{"key": "value"}'` ✓, `'{invalid}'` ✗

#### `html`
- Validates that the string contains HTML markup
- Example: `'<p>text</p>'` ✓, `'plain text'` ✗

#### `text`
- Allows multiline text strings
- Example: `'multi\nline\ntext'` ✓

## Type Generation

TypeScript types are automatically generated from JSON schemas during the build process. The generated types can be found in `src/generated/` and are used for type-safe data handling.

```typescript
import { Product } from './generated/product';
import { FAQItem } from './generated/faqitem';

const product: Product = {
  id: 'prod-123',
  name: 'My Product'
};
```

**Note**: The json-schema-to-typescript library doesn't understand custom format keywords, so fields with only a `format` property (e.g., `{ "format": "json" }`) are generated as generic objects. The runtime validation with AJV will still correctly treat these as strings and validate them according to the custom format rules.

## License

ISC
