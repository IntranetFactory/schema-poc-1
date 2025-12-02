# schema-poc-1

Proof of concept for custom JSON Schema vocabulary in TypeScript using pnpm workspaces.

## Project Structure

This is a **pnpm workspace** with two packages:

### `packages/sem-schema`

The main package implementing a custom JSON Schema vocabulary with additional validation features:
- Custom formats: `json`, `html`, `text`
- Property-level `required` keyword (validates non-empty strings)
- Number `precision` keyword (0-4 decimal places)
- Type inference (format without type defaults to string)

See [packages/sem-schema/README.md](packages/sem-schema/README.md) for full documentation.

### `packages/examples`

Example schemas and validators demonstrating sem-schema usage:
- Product schema with validation
- FAQ Item schema with validation
- Comprehensive test suite

## Installation

```bash
pnpm install
```

## Building

```bash
pnpm build        # Build all packages
```

## Testing

```bash
pnpm test         # Test all packages
pnpm test:watch   # Test in watch mode
```

## Quick Start

### Using sem-schema

```typescript
import { createCustomSchemaValidator, preprocessSchema } from 'sem-schema';

// Create validator with custom vocabulary
const ajv = createCustomSchemaValidator();

// Define schema
const schema = {
  type: 'object',
  properties: {
    email: { type: 'string', required: true },  // Empty strings fail
    config: { format: 'json' },  // Type inferred as string
    price: { type: 'number', precision: 2 }  // Max 2 decimals
  },
  required: ['email']  // Property must exist
};

// Compile and validate
const validate = ajv.compile(preprocessSchema(schema));
console.log(validate({ email: 'user@example.com', config: '{}', price: 99.99 }));
// true
```

## Features

### Custom Formats
- **json**: Validates parseable JSON strings
- **html**: Validates HTML markup (checks for tags)
- **text**: Allows multiline text strings

### Custom Keywords
- **required** (property-level): Boolean - validates non-empty strings
- **precision**: Integer (0-4) - limits decimal places in numbers

### Type Inference
- Schemas with only `format` automatically get `type: "string"`

## Test Organization

Tests are clearly separated into two categories:

### Vocabulary Definition Tests
Tests that verify the custom vocabulary is properly defined:
- Comparison with standard JSON Schema (proves custom keywords work)
- Schema validity tests (can schemas be compiled?)

### Data Validation Tests  
Tests that verify data correctly validates against schemas:
- Valid data passes
- Invalid data fails with correct error messages

## Package Organization

- **sem-schema**: Core vocabulary implementation
  - One file per format (`formats/json.ts`, `formats/html.ts`, etc.)
  - One file per keyword (`keywords/required.ts`, `keywords/precision.ts`)
  - Modular structure for easy extension
- **examples**: Sample schemas and their validators (separate from core vocabulary)

## Development

```bash
# Install dependencies
pnpm install

# Build sem-schema
cd packages/sem-schema && pnpm build

# Run sem-schema tests
cd packages/sem-schema && pnpm test

# Run examples tests
cd packages/examples && pnpm test

# Run all tests from root
pnpm test
```

## License

ISC
