# SemSchema

Custom JSON Schema vocabulary (SemSchema) with additional validation features for use with AJV.

## Features

### Custom Formats
- **`json`**: Validates parseable JSON strings
- **`html`**: Validates HTML markup (requires HTML tags)
- **`text`**: Allows multiline text strings

### Standard Formats
SemSchema also supports all standard JSON Schema formats via `ajv-formats`:
- **Date/Time**: `date`, `time`, `date-time`, `duration`
- **Network**: `email`, `hostname`, `ipv4`, `ipv6`, `uri`, `uri-reference`, `url`
- **Other**: `uuid`, `regex`, `json-pointer`, and more

### Format Validation
- **Unknown formats are rejected**: Using an unrecognized format (e.g., `emailx` instead of `email`) will throw an error during schema validation
- This prevents typos and ensures all formats are properly validated

### Custom Keywords
- **`required`** (property-level): Boolean keyword that validates values are not null/undefined and strings are not empty
  - Different from object-level `required` array in standard JSON Schema
  - When `required: true`, null, undefined, and empty strings fail validation
  - **Important**: Empty string validation applies to ALL string types, regardless of format (json, html, text, date, email, or any other)
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
- `valid`: boolean - true if data is valid, false otherwise
- `errors`: array | null - Array of validation error objects if invalid, null if valid

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
- **Vocabulary Definition Tests**: Verify schemas with custom keywords can be compiled
- **Data Validation Tests**: Verify data correctly validates against schemas

## Extending SemSchema

SemSchema is designed to be extensible. You can add custom formats and keywords to suit your needs.

### Adding a Custom Format

To add a new custom format:

1. **Create a format validator file** in `src/formats/`:

```typescript
// src/formats/my-format.ts
import Ajv from 'ajv';

/**
 * Validate my custom format
 */
export function validateMyFormat(data: string): boolean {
  // Your validation logic here
  return data.startsWith('MY-');
}

/**
 * Add custom format to AJV instance
 */
export function addMyFormat(ajv: Ajv): void {
  ajv.addFormat('my-format', {
    validate: validateMyFormat
  });
}
```

2. **Register the format** in `src/formats/index.ts`:

```typescript
import { addMyFormat } from './my-format';

export function addAllFormats(ajv: Ajv): void {
  // ... existing formats
  addMyFormat(ajv);
}
```

3. **Add to known formats list** in `src/utils.ts`:

```typescript
const KNOWN_FORMATS = new Set([
  // ... existing formats
  'my-format',
]);
```

4. **Add tests** in `src/__tests__/`:

```typescript
describe('Format: my-format', () => {
  it('should validate valid my-format string', () => {
    const schema = { type: 'string', format: 'my-format' };
    expect(validateData('MY-123', schema).valid).toBe(true);
  });
});
```

### Adding a Custom Keyword

To add a new custom keyword:

1. **Create a keyword file** in `src/keywords/`:

```typescript
// src/keywords/my-keyword.ts
import Ajv from 'ajv';

/**
 * Add custom 'my-keyword' keyword to AJV instance
 */
export function addMyKeyword(ajv: Ajv): void {
  ajv.addKeyword({
    keyword: 'my-keyword',
    type: 'string', // or 'number', 'array', etc.
    schemaType: 'boolean', // type of the keyword value in schema
    compile(schemaValue: boolean) {
      return function validate(data: string): boolean {
        if (!schemaValue) return true;
        // Your validation logic here
        return data.length > 0;
      };
    },
    errors: true
  });
}
```

2. **Register the keyword** in `src/keywords/index.ts`:

```typescript
import { addMyKeyword } from './my-keyword';

export function addAllKeywords(ajv: Ajv): void {
  // ... existing keywords
  addMyKeyword(ajv);
}
```

3. **Add validation** (optional) in `src/utils.ts` if you need schema-level validation:

```typescript
export function validateSchemaStructure(schema: SchemaObject, path: string = '#'): SchemaValidationError[] {
  // ... existing validation
  
  // Validate my-keyword
  if (schema['my-keyword'] !== undefined && typeof schema['my-keyword'] !== 'boolean') {
    errors.push({
      path,
      message: 'my-keyword must be a boolean',
      keyword: 'my-keyword',
      value: schema['my-keyword']
    });
  }
}
```

4. **Add tests** for both schema validity and data validation.

### Testing Your Extensions

Always add tests for your custom formats and keywords:

- **Vocabulary tests** (`vocabulary.test.ts`): Test that schemas with your custom keyword/format can be compiled
- **Data validation tests** (`data-validation.test.ts`): Test that data correctly validates

## Vocabulary Definition

The vocabulary includes:
- Custom formats: `json`, `html`, `text`
- Standard formats: All formats from `ajv-formats` (email, date, uri, uuid, etc.)
- Custom keywords: `required` (property-level), `precision`

## License

ISC
