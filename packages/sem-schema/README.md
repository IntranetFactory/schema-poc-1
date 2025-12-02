# SemSchema

Custom JSON Schema vocabulary (SemSchema) with additional validation features for use with AJV.

## Features

### Custom Formats
- **`json`**: Validates parseable JSON strings
- **`html`**: Validates HTML markup (requires HTML tags)
- **`text`**: Allows multiline text strings

### Custom Keywords
- **`required`** (property-level): Boolean keyword that validates non-empty strings
  - Different from object-level `required` array in standard JSON Schema
  - When `required: true`, empty strings fail validation
- **`precision`**: Integer (0-4) limiting decimal places in numbers
  - Example: `precision: 2` allows 99.99 but rejects 99.999

### Type Inference
- When `format` is provided without `type`, defaults to `type: "string"`
- Allows schemas like `{ "format": "json" }` without explicit type declaration

## Installation

```bash
pnpm add sem-schema
```

## Usage

### Basic Usage

```typescript
import { validateSchema, validateData } from 'sem-schema';

// Define schema
const schema = {
  type: 'object',
  properties: {
    email: { 
      type: 'string', 
      required: true  // Property-level: empty strings fail
    },
    config: { 
      format: 'json'  // Type: string inferred
    },
    price: { 
      type: 'number', 
      precision: 2  // Up to 2 decimal places
    }
  },
  required: ['email']  // Object-level: property must exist
};

// Validate the schema itself
validateSchema(schema); // Returns true or throws error

// Validate data against the schema
const result = validateData({ 
  email: 'user@example.com', 
  config: '{"key":"value"}', 
  price: 99.99 
}, schema);

console.log(result.valid); // true
console.log(result.errors); // null

// Invalid data
const invalid = validateData({ 
  email: '', 
  config: '{invalid}', 
  price: 99.999 
}, schema);

console.log(invalid.valid); // false
console.log(invalid.errors); // Array of error objects
```

## API

### `validateSchema(schemaJson)`

Validates that a JSON Schema is valid according to SemSchema vocabulary.

**Parameters**:
- `schemaJson`: SchemaObject - The JSON Schema to validate

**Returns**: `true` if valid

**Throws**: Error if schema is invalid

### `validateData(data, schemaJson)`

Validates data against a JSON Schema using SemSchema vocabulary.

**Parameters**:
- `data`: any - The data to validate
- `schemaJson`: SchemaObject - The JSON Schema to validate against

**Returns**: Object with:
- `valid`: boolean - Whether the data is valid
- `errors`: array | null - Array of validation errors, or null if valid

## Project Structure

```
sem-schema/
├── src/
│   ├── formats/           # Custom format validators (internal)
│   ├── keywords/          # Custom keyword validators (internal)
│   ├── __tests__/
│   │   ├── vocabulary.test.ts      # Vocabulary definition tests
│   │   └── data-validation.test.ts # Data validation tests
│   ├── api.ts             # Public API
│   ├── validator.ts       # Validator creation (internal)
│   ├── utils.ts           # Utilities (internal)
│   ├── vocabulary.json    # Vocabulary definition (internal)
│   └── index.ts           # Main exports
└── dist/                  # Compiled output
```

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
```

The test suite includes:
- **Vocabulary Definition Tests**: Verify SemSchema works and standard AJV fails with custom keywords
- **Data Validation Tests**: Verify data correctly validates against schemas

## Vocabulary Definition

The vocabulary includes:
- Valid format values: `json`, `html`, `text`
- Custom keywords: `required` (property-level), `precision`

Schemas can reference the vocabulary using `$vocabulary` declarations.

## License

ISC
