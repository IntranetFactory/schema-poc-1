# sem-schema

Custom JSON Schema vocabulary with additional validation features for use with AJV.

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
import { createCustomSchemaValidator, preprocessSchema } from 'sem-schema';

// Create AJV instance with sem-schema vocabulary
const ajv = createCustomSchemaValidator();

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

// Preprocess and compile
const processed = preprocessSchema(schema);
const validate = ajv.compile(processed);

// Validate data
validate({ email: 'user@example.com', config: '{"key":"value"}', price: 99.99 });
// Returns: true

validate({ email: '', config: '{invalid}', price: 99.999 });
// Returns: false (empty email, invalid JSON, too many decimals)
```

### Individual Format/Keyword Usage

```typescript
import Ajv from 'ajv';
import { addJsonFormat, addRequiredKeyword } from 'sem-schema';

const ajv = new Ajv();

// Add specific formats
addJsonFormat(ajv);

// Add specific keywords
addRequiredKeyword(ajv);
```

## Project Structure

```
sem-schema/
├── src/
│   ├── formats/           # Custom format validators
│   │   ├── json.ts        # JSON format
│   │   ├── html.ts        # HTML format
│   │   ├── text.ts        # Text format
│   │   └── index.ts       # Exports
│   ├── keywords/          # Custom keyword validators
│   │   ├── required.ts    # Property-level required
│   │   ├── precision.ts   # Number precision
│   │   └── index.ts       # Exports
│   ├── __tests__/         # Tests
│   │   ├── vocabulary.test.ts      # Vocabulary definition tests
│   │   └── data-validation.test.ts # Data validation tests
│   ├── validator.ts       # Main validator creation
│   ├── utils.ts           # Utility functions (preprocessSchema)
│   ├── vocabulary.json    # Vocabulary definition
│   └── index.ts           # Main exports
└── dist/                  # Compiled output
```

## API

### `createCustomSchemaValidator()`

Creates an AJV instance with all sem-schema custom formats and keywords enabled.

**Returns**: `Ajv` instance

### `preprocessSchema(schema)`

Preprocesses a schema to add default types when only format is specified.

**Parameters**:
- `schema`: SchemaObject - The JSON Schema to preprocess

**Returns**: Preprocessed SchemaObject

### Format Validators

- `addJsonFormat(ajv)`: Add JSON format validation
- `addHtmlFormat(ajv)`: Add HTML format validation
- `addTextFormat(ajv)`: Add text format validation
- `addAllFormats(ajv)`: Add all custom formats

### Keyword Validators

- `addRequiredKeyword(ajv)`: Add property-level required keyword
- `addPrecisionKeyword(ajv)`: Add precision keyword for numbers
- `addAllKeywords(ajv)`: Add all custom keywords

## Testing

```bash
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
```

The test suite includes:
- **Vocabulary Definition Tests**: Verify custom vocabulary works and fails with standard AJV
- **Data Validation Tests**: Verify data correctly validates against schemas with custom keywords

## Vocabulary Definition

The vocabulary is defined in `vocabulary.json` and includes:
- Valid format values: `json`, `html`, `text`
- Custom keywords: `required`, `precision`

Schemas can reference the vocabulary using `$vocabulary` declarations.

## License

ISC
