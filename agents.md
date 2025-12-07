# SemSchema Development Notes

This file documents the implementation decisions and rationale for the SemSchema custom JSON Schema vocabulary.

## CRITICAL: Visual Verification Requirements

**MANDATORY for ALL visual/UI changes - NO EXCEPTIONS:**

1. **ALWAYS use Playwright MCP tools for visual verification** - Never rely on assumptions or code inspection
2. **EVERY visual change MUST be verified with screenshots** using `mcp_microsoft_pla_browser_take_screenshot`
3. **ACTUALLY LOOK AT THE SCREENSHOT** - Don't just take it, analyze what it shows
4. **Test actual behavior, not assumptions** - Add content, resize, interact to verify the change works as expected
5. **Use `mcp_microsoft_pla_browser_evaluate` to inspect computed styles** - Tailwind classes may not be applied, check actual CSS
6. **Never claim a visual change is complete without visual proof** - Screenshots showing the EXACT specified behavior are required
- **If the screenshot doesn't match the spec, the work is NOT done** - No excuses, no assumptions
- **Never trust, always verify** - Do not assume code changes will work as expected. Always verify with Playwright.

**Workflow for any UI/visual change:**
1. Make the code change
2. Navigate to the page with `mcp_microsoft_pla_browser_navigate`
3. Take a screenshot with `mcp_microsoft_pla_browser_take_screenshot`
4. **ACTUALLY EXAMINE the screenshot** - Does it match the specification exactly?
5. Use `mcp_microsoft_pla_browser_evaluate` to check computed styles if Tailwind classes are involved
6. If testing scrolling/overflow behavior: 
   - Add significant content using Playwright MCP type/click tools
   - Take another screenshot showing scrollbars
   - Verify the container did NOT expand
7. If testing responsiveness: Resize with `mcp_microsoft_pla_browser_resize` and screenshot at different sizes
8. **Only claim completion when screenshots prove the specification is met**

**WHY THIS IS CRITICAL:**
- Tailwind v4 classes may not apply correctly (e.g., `grid`, `overflow-auto`)
- CSS specificity issues can override classes
- Assumptions about behavior are often wrong
- Taking a screenshot without examining it is worthless
- The user's time is valuable - don't waste it with unverified claims

## Project Overview

SemSchema is a custom JSON Schema vocabulary implemented as an npm package that extends AJV with domain-specific validation constraints. It addresses common JSON Schema limitations by providing:

1. **Custom string formats**: `json`, `html`, `text`
2. **Property-level required validation**: Validates non-null/undefined and non-empty values
3. **Number precision constraints**: Limits decimal places (0-4)
4. **Type inference**: Defaults to string type when only format is specified

## Key Implementation Decisions

### 1. Property-Level `required` Keyword

**Problem**: Standard JSON Schema's `required` keyword only works at the object level (array of property names). It validates that properties exist, but doesn't validate that values are non-empty. An empty string `""` passes validation.

**Solution**: Implemented a custom `required` keyword that:
- Works at the property level (boolean value)
- When `required: true`, validates that values are:
  - Not `null`
  - Not `undefined`
  - Not empty strings (for ALL string types, regardless of format - json, html, text, date, email, or any other)
- Still supports object-level `required` (array) for backward compatibility

**Important**: The empty string validation applies to ALL strings, not just our custom formats. Any string field with `required: true` will reject empty strings, whether it has a format specified or not.

**Implementation**: Replaced AJV's built-in `required` keyword with a custom version that handles both modes:
- Property-level: `required: true` (boolean) - validates value is not null/undefined and strings are not empty
- Object-level: `required: ["prop"]` (array) - validates property exists in object

### 2. Custom Formats

**Why Needed**: JSON Schema supports format validation, but implementations vary. We need consistent validation for:
- `json`: Ensures strings are valid JSON (can be parsed)
- `html`: Ensures strings contain HTML tags (not just plain text)
- `text`: Allows multiline strings (unlike default string which may restrict newlines)

**Implementation**: Each format implemented in separate file (`formats/json.ts`, `formats/html.ts`, `formats/text.ts`) using AJV's `addFormat` method.

### 3. Number Precision

**Why Needed**: Financial and measurement applications often need to restrict decimal places (e.g., currency with 2 decimals).

**Solution**: Custom `precision` keyword (0-4) that validates maximum decimal places.

**Implementation**: Uses string conversion to check decimal places (avoids floating-point comparison issues).

### 4. Type Inference

**Why Needed**: Writing `{ "type": "string", "format": "json" }` is verbose. Format implies type.

**Solution**: Preprocess schemas to add `type: "string"` when only `format` is specified.

**Implementation**: `preprocessSchema` utility recursively walks schema and adds default types.

## Project Structure

### pnpm Workspace

The project uses pnpm workspaces with two packages:

1. **`packages/sem-schema`**: Core vocabulary package (publishable to npm)
   - Modular architecture: one file per format/keyword
   - Minimal public API: just `validateSchema()` and `validateData()`
   - All implementation details kept internal

2. **`packages/examples`**: Sample schemas (product, FAQ)
   - Demonstrates SemSchema usage
   - Keeps examples separate from core package

### Modular Architecture

**Rationale**: With dozens of planned formats/keywords, a single file becomes unmaintainable.

**Structure**:
```
src/
├── formats/       # One file per format (json.ts, html.ts, text.ts)
├── keywords/      # One file per keyword (required.ts, precision.ts)
├── api.ts         # Public API implementation
├── validator.ts   # Internal validator creation
└── utils.ts       # Internal utilities
```

### API Design

**Rationale**: Initial implementation exposed internal details (AJV instance, preprocessing, vocabulary JSON). This creates coupling and makes changes harder.

**Final API**: Just two methods:
- `validateSchema(schemaJson)`: Is this schema valid?
- `validateData(data, schemaJson)`: Does this data match this schema?

Benefits:
- Simple to use and understand
- Implementation can change without breaking consumers
- Tests validate public API, not internal details

## Testing Strategy

### Two Test Categories

1. **Vocabulary Definition Tests** (`vocabulary.test.ts`)
   - Proves custom vocabulary is working
   - Compares standard AJV (fails) vs SemSchema (succeeds)
   - Tests schema compilation

2. **Data Validation Tests** (`data-validation.test.ts`)
   - Tests data validation against schemas
   - Valid data passes
   - Invalid data fails with correct errors

### Test Philosophy

- Tests use only the public API (`validateSchema`, `validateData`)
- No internal implementation details tested
- Clear separation between schema validity and data validation

## Common Pitfalls to Avoid

### 1. Don't Export Internal Details

Early versions exported `createSemSchemaValidator`, `preprocessSchema`, `vocabulary`, individual format/keyword functions. This created tight coupling and exposed implementation.

**Lesson**: Only export what consumers need. Keep everything else internal.

### 2. Clear Test Naming

Tests must clearly indicate what they're testing:
- Schema validity? Use `validateSchema()`
- Data validation? Use `validateData()`

Avoid names like "should handle required" (unclear what's being tested).

### 3. Vocabulary Definition

The `vocabulary.json` file defines valid format values and keywords. This should be referenced in schemas using `$vocabulary` declarations.

### 4. Backward Compatibility

When implementing custom `required` keyword, we remove AJV's built-in version. Our implementation must handle both:
- Object-level: `required: ["name", "email"]` (array)
- Property-level: `required: true` (boolean)

## Future Extensions

When adding new formats/keywords:

1. Create new file in `src/formats/` or `src/keywords/`
2. Export from `formats/index.ts` or `keywords/index.ts`
3. Register in `validator.ts`
4. Add to `vocabulary.json`
5. Add tests in `__tests__/vocabulary.test.ts` and `__tests__/data-validation.test.ts`
6. Update documentation

## Package Publishing

The `sem-schema` package is designed for npm publishing:
- Clean public API
- TypeScript types included
- No dependencies on examples package
- Modular, extensible architecture
