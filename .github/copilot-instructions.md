# GitHub Copilot Instructions for schema-poc-1

This repository contains a proof-of-concept for a custom JSON Schema vocabulary (SemSchema) with a dynamic form generation engine.

## Project Overview

This is a **pnpm workspace** with:
- `packages/sem-schema`: Custom JSON Schema vocabulary with AJV validation
- `apps/frontend`: Interactive React/Vite web playground with dynamic form generation

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Start development server
pnpm dev
# Open http://localhost:5173/
```

## Architecture

### SemSchema Custom Vocabulary (`packages/sem-schema`)

Custom JSON Schema vocabulary extending AJV with:
- **Custom formats**: `json`, `html`, `text`
- **Property-level `required`**: Validates non-null/undefined and non-empty strings (applies to ALL string types, regardless of format)
- **Number `precision`**: Limits decimal places (0-4)
- **Type inference**: Defaults to `type: "string"` when only format is specified

**Critical**: Property-level `required: true` rejects empty strings for ALL string types (json, html, text, date, email, etc.), not just custom formats.

### Form Engine (`apps/frontend/src/components/form`)

Dynamic form generation from JSON Schema:
- Auto-generates forms with TanStack Form and shadcn UI
- Maps schema types/formats to form controls
- Field-level validation (onBlur) and form-level validation (onSubmit)
- Supports all SemSchema custom formats

## Development Rules

### 1. Code Changes - Make Minimal Modifications

- **Always make the smallest possible changes** to address issues
- Never delete or modify working code unnecessarily
- Prefer ecosystem tools (npm, pnpm) over manual changes
- Follow existing patterns and conventions in the codebase

### 2. Testing Requirements

**Before making changes**:
- Run existing tests to understand baseline: `pnpm test`
- Check build: `pnpm build`
- Start dev server: `pnpm dev`

**After making changes**:
- Run tests: `pnpm test`
- Verify functionality manually in the browser
- For UI changes: **ALWAYS** use Playwright to verify visually (see Visual Verification below)

**Test Coverage Requirements**:
- ALL new input controls MUST have comprehensive tests
- Tests must verify: rendering, validation, required fields, invalid/valid values, labels, user interaction
- Follow test template in INSTRUCTIONS.md section "Test Requirements for New Components" (look for "MANDATORY TEST TEMPLATE")

### 3. Styling Rules - Critical for UI Work

**NEVER use inline styles** - Always use Tailwind CSS classes:
- ❌ BAD: `<div style={{ padding: '1rem' }}>`
- ✅ GOOD: `<div className="p-4">`

**Overflow and scrolling**:
- Global styles (html/body) should NOT have `overflow: hidden`
- Only specific pages/components control overflow
- Form playground: `w-screen h-screen overflow-hidden` on wrapper
- Other pages: `min-h-screen` for natural scrolling

**Common patterns**:
```tsx
// Container with spacing
<div className="space-y-6 p-4">

// Flex layout
<div className="flex items-center justify-between gap-4">

// Scrollable area
<div className="overflow-auto max-h-96">
```

### 4. Visual Verification - MANDATORY for UI Changes

**⚠️ ALL UI/visual changes require Playwright verification - NO EXCEPTIONS**

**Before starting visual work**:
1. **READ** `agents.md` "Visual Verification Requirements" section first
2. **READ** `INSTRUCTIONS.md` styling section

**Required workflow for every UI change**:
1. Make code change
2. Navigate to page with Playwright: `playwright-browser_navigate`
3. Take screenshot: `playwright-browser_take_screenshot`
4. **ACTUALLY EXAMINE** the screenshot - does it match requirements?
5. Check computed styles: `playwright-browser_evaluate`
6. **Copy screenshots** from `/tmp/playwright-logs/` to `/screenshots/` directory
7. Use descriptive filenames: `01-feature-before.png`, `02-feature-after.png`
8. Commit screenshots with your changes

**Never**:
- Rely on code inspection alone
- Assume Tailwind classes work without verification
- Leave screenshots only in /tmp (they'll be lost)
- Claim completion without visual proof

### 5. Validation Logic - SemSchema Custom Vocabulary

**CRITICAL**: SemSchema has custom `required` keyword behavior:

**Standard JSON Schema**:
```json
{
  "required": ["name"]  // Only checks if property EXISTS
}
```
- Empty string `""` passes ✅

**SemSchema Custom Vocabulary**:
```json
{
  "properties": {
    "name": { 
      "type": "string",
      "required": true  // Property-level: checks VALUE
    }
  }
}
```
- Empty string `""` fails ❌
- `null` fails ❌
- `undefined` fails ❌
- Applies to ALL string types (json, html, text, date, email, etc.)

**Implementation**: See the property-level validation logic in `packages/sem-schema/src/keywords/required.ts` in the inner `validate` function (checks for null/undefined and empty strings)

### 6. Code Organization

**Modular structure**:
- One file per format: `formats/json.ts`, `formats/html.ts`, etc.
- One file per keyword: `keywords/required.ts`, `keywords/precision.ts`
- Clean public API: Only export `validateSchema` and `validateData`
- Keep internal implementation details private

**DRY principle**:
- Avoid repetitive conditional checks
- Move conditional logic into components themselves
- Components should handle null/undefined internally

## Key Files and Documentation

**Read these files for detailed information**:
- `agents.md`: **CRITICAL agent workflow rules** - Read FIRST before any other documentation, contains mandatory visual verification requirements
- `INSTRUCTIONS.md`: Complete implementation guide, testing requirements, styling rules
- `README.md`: Project overview, quick start, API documentation
- `packages/sem-schema/README.md`: SemSchema API and vocabulary details

**Form Components**: `apps/frontend/src/components/form/`
- `SchemaForm.tsx`: Main form generator
- `Input*.tsx`: Individual form controls
- `FormContext.tsx`: Shared form context

**Validation**: `packages/sem-schema/src/`
- `keywords/required.ts`: Custom required keyword
- `formats/*.ts`: Custom format validators
- `api.ts`: Public API

## Common Pitfalls to Avoid

1. **Don't use inline styles** - Always use Tailwind CSS
2. **Don't skip visual verification** for UI changes - Use Playwright
3. **Don't misunderstand `required`** - It validates values, not just existence
4. **Don't export internal details** - Keep API minimal
5. **Don't assume Tailwind classes work** - Always verify with computed styles
6. **Don't skip tests** - All new components need comprehensive tests
7. **Don't add global overflow:hidden** - Only specific pages should control overflow

## Memory/Context

Use `store_memory` tool to save important facts about:
- Codebase conventions discovered during work
- Build/test commands that have been verified
- Validation patterns and requirements
- Styling patterns and Tailwind usage

## Getting Help

If you encounter issues:
1. Check `INSTRUCTIONS.md` for detailed implementation guidelines
2. Check `agents.md` for visual verification requirements
3. Run tests to understand expected behavior: `pnpm test`
4. Check existing components for patterns to follow
5. Use Playwright to debug visual issues
