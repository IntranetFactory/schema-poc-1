# SemSchema Development Notes

This file documents the implementation decisions and rationale for the SemSchema custom JSON Schema vocabulary.

## 🚨🚨🚨 CRITICAL: SCREENSHOTS ARE MANDATORY FOR ALL VISUAL CHANGES 🚨🚨🚨

**❌❌❌ IF YOU MAKE ANY UI/VISUAL CHANGE WITHOUT SCREENSHOTS, YOUR WORK WILL BE REJECTED ❌❌❌**

**BEFORE YOU DO ANYTHING ELSE:**
1. **DID YOU MAKE ANY VISUAL/UI CHANGES?** → If YES, you MUST take screenshots
2. **HAVE YOU TAKEN SCREENSHOTS?** → If NO, STOP and take them NOW
3. **ARE SCREENSHOTS IN /screenshots/ DIRECTORY?** → If NO, you forgot them AGAIN
4. **DID YOU COMMIT SCREENSHOTS WITH report_progress?** → If NO, they're useless
5. **DID YOU INCLUDE SCREENSHOT LINKS IN YOUR PR/COMMENTS?** → If NO, do it NOW

**SCREENSHOT CHECKLIST - COMPLETE THIS BEFORE CLAIMING YOU'RE DONE:**
- [ ] Screenshots saved to `/screenshots/` directory (NOT /tmp, NOT external hosting)
- [ ] Descriptive filenames used (01-feature-before.png, 02-feature-after.png)
- [ ] **DO NOT CREATE README.md IN /screenshots/** - User does NOT want documentation files there
- [ ] Screenshots committed to repository using report_progress
- [ ] Screenshot filenames and descriptions listed in PR/commit message (NOT in a README file)
- [ ] BEFORE and AFTER screenshots taken for every visual change
- [ ] Screenshots actually examined to verify they match requirements

**IF YOU SKIP SCREENSHOTS:**
- Your work demonstrates incompetence and unreliability
- You waste the user's time who has to ask you repeatedly
- You force the user to do your job of visual verification
- You will be criticized harshly and deservedly

## 🚨 CRITICAL: AGENT INSTRUCTIONS - READ THIS BEFORE ANYTHING ELSE 🚨

**⚠️ THIS FILE CONTAINS MANDATORY WORKFLOW RULES FOR AGENTS ⚠️**

**IF YOU ARE AN AI AGENT:**
- **READ THIS FILE FIRST** - Lines 1-150 - BEFORE any other documentation
- **THEN** read INSTRUCTIONS.md for technical implementation details
- **NEVER** skip to code without reading both files in this order

**CRITICAL RULES:**
- **❌ NEVER use store_memory tool** - All agent instructions and reminders MUST be stored in this file (agents.md)
- **❌ DO NOT use proprietary memory tools** - They don't persist across sessions or agents
- **✅ ALWAYS update agents.md** when you learn important workflow rules or user preferences
- **✅ This file is the ONLY place** for storing agent instructions and patterns

**FILE PURPOSES:**
- **agents.md** (THIS FILE) = Agent workflow, visual verification, screenshot requirements, ALL agent instructions
- **INSTRUCTIONS.md** = Technical details, testing, validation, styling conventions

## 🚨 CRITICAL: Visual Verification Requirements - READ THIS FIRST 🚨

**⚠️ WARNING: Ignoring these requirements wastes user time and demonstrates incompetence ⚠️**

**MANDATORY for ALL visual/UI changes - ZERO EXCEPTIONS ALLOWED:**

### Before You Start ANY Visual Work:

**READ THIS SECTION** - Lines 1 to 120 - EVERY SINGLE TIME you work on visual changes
**DO NOT SKIP TO CODE** - You WILL make mistakes if you don't read this first
**DO NOT START CODING UNTIL YOU UNDERSTAND THE SCREENSHOT WORKFLOW**

### The Iron Rules:

1. **ALWAYS use Playwright MCP tools for visual verification** 
   - ❌ NEVER rely on code inspection alone
   - ❌ NEVER assume Tailwind classes are working
   - ✅ ALWAYS test on actual running application

2. **EVERY visual change MUST be verified with screenshots STORED IN THE REPOSITORY**
   - Use `playwright-browser_take_screenshot` for EVERY change
   - Take BEFORE and AFTER screenshots
   - **CRITICAL: Save screenshots to /screenshots/ directory in the repository**
   - Use descriptive filenames: `01-feature-before.png`, `02-feature-after.png`
   - **❌ DO NOT CREATE README.md IN /screenshots/** - List screenshot names in PR/commit message instead
   - **⚠️ SCREENSHOT LINKS IN PR/COMMENTS:**
     - ❌ NEVER use GitHub asset URLs like `https://github.com/user-attachments/assets/xxx` - THESE DO NOT WORK
     - ❌ NEVER upload screenshots outside the repository
     - ✅ ALWAYS store screenshots in `/screenshots/` directory in the repository
     - ✅ ALWAYS reference screenshots using relative paths like `![Description](screenshots/filename.png)`
     - ✅ ALWAYS commit screenshots to the repository with `report_progress`
     - ✅ ALWAYS list screenshot filenames and what they show in your PR/commit message
   - ❌ NEVER leave screenshots only in /tmp - they will be lost
   - ❌ NEVER rely on external screenshot hosting - it breaks and wastes user time

3. **ACTUALLY EXAMINE THE SCREENSHOT**
   - Don't just take it and ignore it
   - Compare it pixel-by-pixel with the specification
   - Look for: borders, shadows, spacing, colors, alignment, scrollbars

4. **Test actual behavior, not assumptions**
   - Click buttons, open dropdowns, scroll content
   - Add content to test overflow behavior
   - Resize windows to test responsiveness

5. **Use `playwright-browser_evaluate` to inspect computed styles**
   - Tailwind v4 classes MAY NOT be applied
   - Check: border, boxShadow, overflow, display, grid properties
   - If classes don't work, you MUST investigate why

6. **NEVER claim completion without visual proof**
   - Screenshots showing EXACT specified behavior are required
   - If the screenshot doesn't match the spec → NOT DONE
   - No excuses, no assumptions, no shortcuts

7. **Never trust, always verify**
   - Your code changes might not work as expected
   - CSS specificity might override your classes
   - Browser rendering might be different than you think

8. **Provide COMPREHENSIVE screenshots for ALL visual issues**
   - If an issue mentions multiple visual problems, take screenshots for EACH ONE
   - Use long-form schemas that trigger scrollbars when testing layout
   - Include computed style inspection results in replies
   - Never provide partial screenshots - cover all aspects mentioned in issue

### If You Ignore These Requirements:

- Your work will be rejected
- You will waste the user's valuable time
- You will have to redo the work correctly
- You demonstrate that you don't read documentation
- You will be asked repeatedly to provide screenshots you should have included initially

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

## 🚨 CRITICAL: Testing Requirements - MANDATORY FOR ALL CHANGES 🚨

**⚠️ NEVER COMMIT CODE WITH FAILING TESTS ⚠️**

### Testing Workflow - ZERO EXCEPTIONS:

1. **ALWAYS run the full test suite BEFORE committing**
   - Run tests: `cd apps/frontend && pnpm test`
   - Review ALL test failures
   - Determine if failures are caused by your changes or pre-existing

2. **If tests fail:**
   - ✅ If failures are NEW and caused by your changes: **FIX THEM**
   - ✅ If failures are PRE-EXISTING (unrelated to your work): **DOCUMENT THEM** in PR/comments
   - ❌ NEVER commit code that introduces new test failures
   - ❌ NEVER ignore test failures without investigation

3. **Test verification checklist:**
   - [ ] Run `pnpm test` for the specific components you changed
   - [ ] Run full test suite `pnpm test` to catch regressions
   - [ ] Document any pre-existing failures clearly
   - [ ] Fix any new failures before committing
   - [ ] Build succeeds: `pnpm build` completes without errors

4. **In PR descriptions:**
   - State explicitly which tests pass related to your changes
   - List any pre-existing test failures with clear explanation they existed before your work
   - Provide test run output showing your changes don't break tests

**WHY THIS IS CRITICAL:**
- Broken tests indicate broken functionality
- Committing failing tests wastes user time on investigation
- Pre-existing failures must be documented to avoid confusion
- Test failures are NOT optional to fix if you caused them

**REMEMBER:** 
- Tests exist to catch bugs
- Your code changes MUST pass tests
- If tests need updating due to intentional behavior changes, update them
- Never skip testing to save time - it costs more time later

## 🚨 CRITICAL: Custom Vocabulary - READ THIS BEFORE VALIDATION WORK 🚨

**⚠️ DO NOT WORK ON VALIDATION WITHOUT READING THIS ⚠️**

### SemSchema Property-Level `required` - MANDATORY KNOWLEDGE

**This is NOT standard JSON Schema** - Read carefully:

**Standard JSON Schema:**
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  },
  "required": ["name"]  // ← Only checks if property EXISTS
}
```
- An empty string `""` **PASSES** validation ✅
- Only checks if the property key exists in the object

**SemSchema Custom Vocabulary:**
```json
{
  "type": "object", 
  "properties": {
    "name": { 
      "type": "string",
      "required": true  // ← Property-level: checks VALUE
    }
  },
  "required": ["name"]  // ← Can use both!
}
```
- Empty string `""` **FAILS** validation ❌
- `null` **FAILS** validation ❌  
- `undefined` **FAILS** validation ❌
- **Applies to ALL string types** regardless of format (json, html, text, date, email, enum, etc.)

### Implementation Location

- **Keyword implementation**: `/packages/sem-schema/src/keywords/required.ts` lines 46-73
- **Tests**: `/packages/sem-schema/src/__tests__/data-validation.test.ts` lines 53-116
- **Schema tests**: `/packages/sem-schema/src/__tests__/vocabulary.test.ts` lines 31-45

### When Working on Form Validation

**YOU MUST** understand that SchemaForm's `validateField` function needs to:
1. Check for empty values (undefined, null, '') BEFORE calling validateData
2. This is because the custom vocabulary expects this behavior
3. The validateField function at `/apps/frontend/src/components/form/SchemaForm.tsx` handles this

**If you modify validation logic, you MUST:**
- Read the custom vocabulary implementation first
- Understand both property-level and object-level required
- Test with empty strings, null, and undefined
- Verify enum, text, and all string formats

## Project Overview

SemSchema is a custom JSON Schema vocabulary implemented as an npm package that extends AJV with domain-specific validation constraints. It addresses common JSON Schema limitations by providing:

1. **Custom string formats**: `json`, `html`, `text`
2. **Property-level required validation**: Validates non-null/undefined and non-empty values (see CRITICAL section above)
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

## 🚨 CRITICAL: Schema Vocabulary Extensions - MANDATORY THREE-STEP PROCESS 🚨

**⚠️ READ THIS BEFORE ADDING ANY KEYWORD TO vocabulary.json ⚠️**

### The Problem That Must NEVER Happen Again

When adding a keyword to `vocabulary.json` (like the `table` keyword), if you don't implement validation logic AND comprehensive tests, **invalid schemas will pass validation** and break production systems.

**EXAMPLE OF THE BUG:**
- Added `table` keyword with `table_name` property defined as `type: "string"` in vocabulary.json
- Did NOT add validation logic in `validateSchemaStructure()`
- Result: Schema with `table_name: 123` (a number!) was marked as VALID ✅ when it should be INVALID ❌
- This breaks applications that rely on schemas being correct

### MANDATORY Three-Step Process for Schema Extensions

**WHENEVER you add a keyword to vocabulary.json, you MUST complete ALL THREE steps:**

#### Step 1: Add Keyword to vocabulary.json
- Define the keyword structure and property types
- Document what the keyword is for

#### Step 2: Add Validation Logic to validateSchemaStructure() in utils.ts
- **IMMEDIATELY after adding to vocabulary.json**, add validation in `validateSchemaStructure()`
- Validate ALL properties match their expected types from vocabulary.json
- Check if values are objects/arrays/strings/numbers/booleans as defined
- Provide clear error messages: `Invalid {keyword}.{property} value. Must be a {type}, got {actualType}`
- Use constants for property lists (e.g., `TABLE_STRING_PROPERTIES`) instead of hardcoded arrays

#### Step 3: Add Comprehensive Tests to vocabulary.test.ts
- **IMMEDIATELY after adding validation logic**, add tests for invalid types
- Test EVERY property with wrong types:
  - String property with number value
  - String property with boolean value
  - Object property with string value
  - Array property with object value
- Test multiple invalid properties simultaneously
- Verify error messages are correct and specific
- Test positive cases (valid keywords) AND negative cases (invalid types)

### Example Implementation

**vocabulary.json:**
```json
{
  "properties": {
    "table": {
      "type": "object",
      "properties": {
        "table_name": { "type": "string" }
      }
    }
  }
}
```

**utils.ts - Add constant and validation:**
```typescript
const TABLE_STRING_PROPERTIES = ['table_name', 'singular', 'plural'] as const;

// In validateSchemaStructure():
if (schema.table !== undefined) {
  if (typeof schema.table !== 'object' || schema.table === null || Array.isArray(schema.table)) {
    errors.push({ message: 'Invalid table value. Must be an object', keyword: 'table' });
  } else {
    const tableProps = schema.table as Record<string, any>;
    for (const prop of TABLE_STRING_PROPERTIES) {
      if (tableProps[prop] !== undefined && typeof tableProps[prop] !== 'string') {
        errors.push({ 
          message: `Invalid table.${prop} value. Must be a string, got ${typeof tableProps[prop]}`,
          keyword: 'table',
          value: tableProps[prop]
        });
      }
    }
  }
}
```

**vocabulary.test.ts - Add tests:**
```typescript
it('should reject schema with table_name as number', () => {
  const schema = { type: 'object', table: { table_name: 123 } };
  const result = validateSchema(schema);
  expect(result.valid).toBe(false);
  expect(result.errors?.[0]?.message).toContain('table.table_name');
  expect(result.errors?.[0]?.message).toContain('Must be a string');
});

it('should reject schema with multiple invalid table properties', () => {
  const schema = { 
    type: 'object', 
    table: { table_name: 123, singular: false, plural: null } 
  };
  const result = validateSchema(schema);
  expect(result.valid).toBe(false);
  expect(result.errors?.length).toBeGreaterThanOrEqual(2);
});
```

### Why This Is CRITICAL

1. **Incomplete keyword definitions cause silent failures** - Bad schemas pass validation
2. **Production systems break** - Applications assume schemas are valid when they're not
3. **Type safety is compromised** - Code expects strings but gets numbers
4. **Debugging is nightmare** - Invalid schemas work in dev but break in production

### Validation Pattern for Keywords

**For object-type keywords (like `table`):**
1. Check if keyword is object (not null, not array)
2. For each property defined in vocabulary.json:
   - Check if value type matches vocabulary definition
   - Add specific error for each mismatch
   - Include property name and actual type in error message

**For simple keywords (like `precision`):**
1. Check type (number, boolean, string, etc.)
2. Check constraints (min/max, enum values, etc.)
3. Add error with clear message about what's wrong

### DO NOT FORGET

- ❌ Adding keyword to vocabulary.json alone does NOTHING
- ❌ Schema will accept invalid values without validation logic
- ❌ Tests won't catch the bug without invalid-type tests
- ✅ ALWAYS complete all three steps together
- ✅ Think: "What invalid values should be rejected?"
- ✅ Write tests that verify rejection of invalid types

**IF YOU SKIP ANY STEP, YOU HAVE INTRODUCED A BUG THAT WILL BREAK PRODUCTION.**

## Future Extensions

When adding new formats/keywords:

1. Create new file in `src/formats/` or `src/keywords/`
2. Export from `formats/index.ts` or `keywords/index.ts`
3. Register in `validator.ts`
4. Add to `vocabulary.json`
5. **IMMEDIATELY add validation logic in `validateSchemaStructure()` in utils.ts** (see CRITICAL section above)
6. **IMMEDIATELY add comprehensive tests in `__tests__/vocabulary.test.ts`** (see CRITICAL section above)
7. Add data validation tests in `__tests__/data-validation.test.ts`
8. Update documentation

## Package Publishing

The `sem-schema` package is designed for npm publishing:
- Clean public API
- TypeScript types included
- No dependencies on examples package
- Modular, extensible architecture
