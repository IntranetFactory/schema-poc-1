# Custom JSON Schema Vocabulary POC

This project demonstrates a custom JSON Schema vocabulary implementation in TypeScript with AJV validation.

## Custom Vocabulary

### Vocabulary Definition

The custom vocabulary is defined in `src/vocabulary.json` and includes:

- **Custom formats**: `json`, `html`, `text` - Valid string format values
- **Property-level `required`**: Boolean constraint for non-empty strings
- **`precision`**: Integer constraint (0-4) for number decimal places

### Custom Keywords

#### 1. Custom String Formats

- **`json`**: Validates that a string contains valid parseable JSON
- **`html`**: Validates that a string contains HTML markup (requires HTML tags)
- **`text`**: Allows multiline text strings

```json
{
  "type": "string",
  "format": "json"
}
```

#### 2. Property-Level `required` (Boolean)

The `required` keyword works at **two levels**:

- **Property-level** `"required": true` (boolean) → string must not be empty (custom keyword)
- **Object-level** `"required": ["field1", "field2"]` (array) → standard JSON Schema (fields must exist)

```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "required": true
    }
  },
  "required": ["email"]
}
```

In the example above:
- Object-level `required`: ["email"] means the `email` property must exist in the object
- Property-level `required: true` means the `email` value cannot be an empty string

#### 3. Number `precision` (Integer 0-4)

Validates the maximum number of decimal places allowed:

```json
{
  "type": "number",
  "precision": 2
}
```

- `precision: 0` → integers only (e.g., 10, -5)
- `precision: 2` → up to 2 decimals (e.g., 99.99)
- `precision: 4` → up to 4 decimals (e.g., 3.1415)

#### 4. Default Type Inference

When `format` is provided without `type`, it defaults to `"string"`:

```json
{
  "format": "json"
}
```

is equivalent to:

```json
{
  "type": "string",
  "format": "json"
}
```

## Project Structure

```
schema-poc-1/
├── src/
│   ├── schemas/                    # Sample JSON Schema definitions
│   │   ├── product.schema.json
│   │   └── faqitem.schema.json
│   ├── validators/                 # Validation logic
│   │   ├── custom-keywords.ts      # Custom format & keyword implementations
│   │   └── index.ts                # Compiled validators
│   ├── __tests__/                  # Test files
│   │   ├── schema-validation.test.ts   # Schema validity & data validation tests
│   │   └── data-validation.test.ts     # Product & FAQ data validation tests
│   ├── vocabulary.json             # Vocabulary definition
│   ├── example.ts                  # Usage examples
│   └── index.ts                    # Main exports
└── dist/                           # Compiled JavaScript output
```

## Installation

```bash
npm install
```

## Usage

### Using Pre-compiled Validators

```typescript
import { validateProduct, validateFaqItem } from './validators';

const product = {
  id: 'prod-123',
  name: 'Wireless Headphones',
  description: 'Premium headphones\nwith noise cancellation',
  detailedDescription: '<p>High quality audio</p>',
  metadata: '{"brand": "TechCo"}',
  price: 299.99,
  stock: 150,
  rating: 4.5,
  tags: ['electronics', 'audio']
};

if (validateProduct(product)) {
  console.log('✓ Product is valid!');
} else {
  console.error('✗ Validation errors:', validateProduct.errors);
}
```

### Creating Custom Validators

```typescript
import { createAjvInstance, preprocessSchema } from './validators/custom-keywords';

// Create AJV instance with custom keywords
const ajv = createAjvInstance();

// Define schema
const mySchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      required: true  // Property-level: no empty strings
    },
    config: {
      format: 'json'  // Type: string inferred
    },
    price: {
      type: 'number',
      precision: 2  // Up to 2 decimal places
    }
  },
  required: ['email']  // Object-level: email property must exist
};

// IMPORTANT: Preprocess schema to handle custom keywords
const processed = preprocessSchema(mySchema);

// Compile validator
const validate = ajv.compile(processed);

// Validate data
const data = {
  email: 'user@example.com',
  config: '{"key": "value"}',
  price: 99.99
};

if (validate(data)) {
  console.log('Valid!');
} else {
  console.log('Errors:', validate.errors);
}
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run all tests (schema validity + data validation)
- `npm run test:watch` - Run tests in watch mode

## Testing

The project includes comprehensive tests organized into two categories:

### 1. Schema Validation Tests (`schema-validation.test.ts`)

Tests that verify:
- **Schema Validity**: Can schemas with custom keywords be compiled?
- **Data Validation**: Does data correctly validate/fail against schemas?

Tests cover:
- Custom formats (json, html, text)
- Property-level `required` transformation
- Number `precision` validation
- Type inference from `format`

### 2. Data Validation Tests (`data-validation.test.ts`)

Tests that verify:
- **Schema Validity**: Are the sample schemas (product, faqitem) valid?
- **Data Validation**: Do product and FAQ data correctly validate against their schemas?

Tests cover:
- Valid and invalid product data
- Valid and invalid FAQ item data
- Error reporting for constraint violations

Run tests:
```bash
npm test
```

## Sample Schemas

### Product Schema

Located in `src/schemas/product.schema.json`, demonstrates:
- Object-level `required` array: ["id", "name"]
- Property-level `required: true` on id and name fields
- Custom formats: `text`, `html`, `json`
- Number `precision`: 0, 1, 2

### FAQ Item Schema

Located in `src/schemas/faqitem.schema.json`, demonstrates:
- Object-level `required` array: ["id", "question", "answer"]
- Property-level `required: true` on multiple fields
- HTML format for answers
- Number precision validation

## Vocabulary URI

The custom vocabulary is identified by:
- `$schema`: `https://example.com/meta/custom-vocabulary`
- `$vocabulary`: Declares which vocabularies are used

Each schema declares the vocabularies it uses:
```json
{
  "$schema": "https://example.com/meta/custom-vocabulary",
  "$vocabulary": {
    "https://json-schema.org/draft/2020-12/vocab/core": true,
    "https://json-schema.org/draft/2020-12/vocab/validation": true,
    "https://example.com/vocab/custom-formats": true,
    "https://example.com/vocab/custom-validation": true
  }
}
```

## Implementation Notes

### Custom `required` Keyword

The property-level `required` keyword is implemented by:

1. Removing AJV's built-in object-level `required` keyword
2. Adding our custom version that handles BOTH:
   - Property-level: `required: true` (boolean) for strings → validates non-empty
   - Object-level: `required: ["prop"]` (array) for objects → validates property exists

This allows the same keyword name to work at different levels with different types.

### Why Preprocessing is Necessary

1. Handles default type inference (`format` without `type`)
2. Must be called before `ajv.compile()` for proper validation

## Example

See `src/example.ts` for a comprehensive demonstration of:
- Valid and invalid product validation
- Valid and invalid FAQ validation
- Error handling and reporting

Run the example:
```bash
npx ts-node src/example.ts
```

## License

ISC
