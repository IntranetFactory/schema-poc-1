# Schema Form Engine - Implementation Instructions

## Overview

The schema form engine provides dynamic form generation based on JSON Schema with AJV validation using the sem-schema vocabulary. Forms are built with TanStack Form and shadcn UI components.

## Architecture

### Form Components (`apps/frontend/src/components/form/`)

Each format/type has a dedicated form control component:

- **TextInput** - Basic text input (string type)
- **EmailInput** - Email input with validation (format: "email")
- **NumberInput** - Number/integer input
- **TextareaInput** - Multi-line text (format: "text") 
- **CheckboxInput** - Boolean checkbox
- **DateInput** - Date picker with calendar (format: "date")
- **HtmlEditor** - CodeMirror editor with HTML syntax highlighting (format: "html")
- **JsonEditor** - CodeMirror editor with JSON syntax highlighting (format: "json")

All components implement the `FormControlProps` interface for consistency:
```typescript
interface FormControlProps {
  name: string
  label?: string
  description?: string
  value: any
  error?: string
  required?: boolean
  disabled?: boolean
  onChange: (value: any) => void
  onBlur?: () => void
}
```

### SchemaForm Component

The `SchemaForm` component (`apps/frontend/src/components/form/SchemaForm.tsx`) is the main entry point:

- **Auto-generates forms** from JSON Schema
- **Maps schema types/formats** to appropriate controls
- **Generates default values** from schema `default` fields or infers by type
- **Validates fields individually** onBlur using AJV
- **Validates entire form** on submit
- Supports both sem-schema's field-level `required: true` and standard `required: ["field"]`

### Form Viewer Route

The `/form-viewer` route (`apps/frontend/src/routes/form-viewer.tsx`) provides a demo:
- Accepts schema URL as query parameter: `?schema=<url>`
- Fetches schema and renders form dynamically  
- Validates form on submit (no actual submission)
- Displays submitted data for verification

## Usage

```tsx
import { SchemaForm } from '@/components/form'

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', required: true, minLength: 1 },
    email: { type: 'string', format: 'email' },
    bio: { format: 'text' },
    config: { format: 'json' }
  },
  required: ['name', 'email']
}

<SchemaForm 
  schema={schema} 
  initialValue={data}
  onSubmit={(value) => console.log('Valid data:', value)} 
/>
```

## Validation

### Field-Level (onBlur)

Each field validates when it loses focus:
```typescript
validators={{
  onBlur: ({ value }) => validateField(value, propSchema, key, schema)
}}
```

### Form-Level (onSubmit)

The entire form validates on submit:
```typescript
const result = validateData(value, schema)
if (result.valid) {
  onSubmit?.(value)
} else {
  // Display errors on each field
}
```

Validation uses the sem-schema validator which extends AJV with:
- Custom formats: `json`, `html`, `text`
- Property-level `required` keyword (non-empty strings)
- Number `precision` keyword (0-4 decimal places)

## Styling

### Current State

The form components use shadcn UI components (Input, Label, Textarea, Checkbox, Button, DatePicker) with **Tailwind CSS classes**.

**CRITICAL STYLING RULES:**

1. **NEVER use inline styles** - Always use Tailwind CSS utility classes
   - ❌ BAD: `<div style={{ padding: '1rem', display: 'flex' }}>`
   - ✅ GOOD: `<div className="p-4 flex">`

2. **Follow shadcn/ui conventions** - Use established Tailwind patterns
   - Use semantic color classes: `bg-background`, `text-foreground`, `border-input`
   - Use spacing utilities: `space-y-2`, `gap-4`, `p-4`, `m-2`
   - Use layout utilities: `flex`, `grid`, `items-center`, `justify-between`

3. **Apply overflow styles carefully**
   - Global styles (html/body) should NOT have `overflow: hidden`
   - Only specific pages/components should control overflow
   - Form playground needs `w-screen h-screen overflow-hidden` on its wrapper
   - Other pages should use `min-h-screen` for natural scrolling

4. **Common Tailwind patterns:**
   ```tsx
   // Container with spacing
   <div className="space-y-6 p-4">
   
   // Flex layout
   <div className="flex items-center justify-between gap-4">
   
   // Full viewport (only for specific pages)
   <div className="w-screen h-screen overflow-hidden">
   
   // Scrollable area
   <div className="overflow-auto max-h-96">
   
   // Loading state
   <div className="flex items-center justify-center h-screen text-muted-foreground">
   ```

### Known Styling Issues

If Tailwind classes don't appear to work:
1. **Verify Tailwind v4 Configuration**: Check content scanning in config
2. **Check PostCSS Configuration**: Ensure PostCSS processes Tailwind directives
3. **Inspect Build Output**: Verify utility classes exist in generated CSS
4. **Never fall back to inline styles** - Fix the Tailwind configuration instead

### Expected Visual Appearance

When properly styled with shadcn/Tailwind, forms should have:
- **Input fields**: Visible borders, rounded corners, padding, proper height
- **Labels**: Appropriate font size and spacing
- **Description text**: Muted color, smaller font
- **Error messages**: Red/destructive color
- **Spacing**: Consistent gaps between form fields (space-y-2, space-y-6)
- **Focus states**: Ring/outline on focused inputs
- **Disabled states**: Reduced opacity and cursor changes

## Testing

### Quality Standards

**CRITICAL**: All code changes MUST meet these quality standards before submission:

1. **Visual Verification Required**
   - ALWAYS use Playwright to visually verify UI changes
   - Take screenshots of BEFORE and AFTER states
   - Include screenshots in PR descriptions
   - Verify on actual running application, not just tests

2. **Form Validation Testing**
   - Test submit button with empty required fields
   - Verify error messages appear correctly
   - Test field-level validation (onBlur)
   - Test form-level validation (onSubmit)
   - Ensure validation errors are displayed to users

3. **Layout and Styling**
   - Verify no unwanted scrollbars appear on viewport
   - Ensure form areas scroll when content overflows
   - Check all inputs have proper borders and shadows
   - Verify date pickers and dropdowns render correctly
   - Test responsive behavior

4. **Test Coverage**
   - ALL new input controls MUST have tests
   - Tests must verify rendering, validation, and user interaction
   - Failing tests indicate failing functionality
   - Run full test suite before committing: `pnpm test`

### Manual Testing

1. Start dev server: `pnpm dev`
2. Navigate to: `http://localhost:5173/form-playground?schema=/schemas/all-formats.schema.json`
3. Verify:
   - No scrollbars on page viewport
   - Form area scrolls when content overflows
   - All field types render with proper styling
   - Field validation triggers onBlur
   - Form validation triggers on submit  
   - Error messages display correctly
   - CodeMirror editors work for HTML/JSON
   - Date picker has shadow/border
   - Date picker calendar displays correctly

### Automated Tests

All form components have comprehensive test coverage:
- **Unit tests** for each form control component (26 test files, 57 tests)
- **Integration tests** for SchemaForm (15 tests)
  - Field-level validation (onBlur)
  - Form-level validation (onSubmit)
  - Required field validation
  - Default value handling
  - Reset functionality
- **E2E tests** should be added for form-playground route

#### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development  
pnpm test:watch

# Run tests for a specific component
pnpm test InputDate
```

#### Test Requirements for New Components

**CRITICAL**: ALL input controls MUST have comprehensive tests that validate:

1. **Rendering Test**: Verify component renders with correct type/structure
2. **Styling Test**: Check proper Tailwind/CSS classes are applied (NOT inline styles)
3. **Required Field Test**: Show asterisk (*) when field is marked as required
4. **Required Validation Test**: Detect and show error when required field is empty
5. **Invalid Value Detection Test**: Validate format-specific rules and show errors
6. **Valid Value Acceptance Test**: Accept correctly formatted values without error
7. **Label/Description Test**: Display label and description text correctly
8. **User Interaction Test**: Test typing/interaction and value changes

**MANDATORY TEST TEMPLATE** - Use this for ALL input controls:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import { InputControlName } from '../InputControlName'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputControlName', () => {
  function TestWrapper({ 
    children, 
    required = false,
    validatorFn = () => undefined
  }: { 
    children: React.ReactNode
    required?: boolean
    validatorFn?: (value: any) => string | undefined
  }) {
    const form = useForm({
      defaultValues: { fieldName: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { 
        type: 'object', 
        properties: {
          fieldName: { type: 'string', format: 'specific-format', required }
        },
        required: required ? ['fieldName'] : []
      },
      validateField: validatorFn,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  // 1. Rendering Test
  it('should render with correct type/structure', () => {
    const { container } = render(
      <TestWrapper>
        <InputControlName name="fieldName" />
      </TestWrapper>
    )
    const element = container.querySelector('[type="..."]') // or other selector
    expect(element).toBeTruthy()
  })

  // 2. Required Indicator Test
  it('should show required indicator (*) when required', () => {
    render(
      <TestWrapper required>
        <InputControlName name="fieldName" label="Field" required />
      </TestWrapper>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  // 3. Required Validation Test - CRITICAL
  it('should validate required field and show error when empty', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper 
        required
        validatorFn={(value) => !value || value.trim() === '' ? 'must not be empty' : undefined}
      >
        <InputControlName 
          name="fieldName" 
          label="Field" 
          required
          validators={{
            onBlur: ({ value }) => !value || value.trim() === '' ? 'must not be empty' : undefined,
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/field/i)
    await user.click(input)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/must not be empty/i)).toBeInTheDocument()
    })
  })

  // 4. Invalid Value Detection Test - CRITICAL
  it('should detect invalid format and show error', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper
        validatorFn={(value) => {
          if (!value) return undefined
          // Add format-specific validation logic
          return isInvalidFormat(value) ? 'must match format "specific-format"' : undefined
        }}
      >
        <InputControlName 
          name="fieldName" 
          label="Field"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return undefined
              return isInvalidFormat(value) ? 'must match format "specific-format"' : undefined
            },
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/field/i)
    await user.type(input, 'invalid-value')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/must match format/i)).toBeInTheDocument()
    })
  })

  // 5. Valid Value Acceptance Test - CRITICAL  
  it('should accept valid values without error', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper
        validatorFn={(value) => {
          if (!value) return undefined
          return isInvalidFormat(value) ? 'must match format "specific-format"' : undefined
        }}
      >
        <InputControlName 
          name="fieldName" 
          label="Field"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return undefined
              return isInvalidFormat(value) ? 'must match format "specific-format"' : undefined
            },
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/field/i) as HTMLInputElement
    await user.type(input, 'valid-value')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText(/must match format/i)).not.toBeInTheDocument()
      expect(input.value).toBe('valid-value')
    })
  })

  // 6. Label/Description Test
  it('should display label and description', () => {
    render(
      <TestWrapper>
        <InputControlName 
          name="fieldName" 
          label="Field Label" 
          description="Field description"
        />
      </TestWrapper>
    )
    expect(screen.getByText('Field Label')).toBeInTheDocument()
    expect(screen.getByText('Field description')).toBeInTheDocument()
  })
})
```

**Why These Tests Are Critical:**
- **Required validation tests** ensure empty required fields are caught before submit
- **Invalid value tests** ensure bad data is rejected (e.g., malformed emails, invalid JSON)
- **Valid value tests** ensure good data is accepted (prevents false positives)
- Tests failing means the control is broken - they MUST pass

## Known Limitations

1. **Tailwind v4 Styling Issue**: Utility classes not generating CSS (see Styling section)
2. **No array/object field support**: Only primitive types and string formats supported
3. **Limited validation feedback**: Only shows first error per field
4. **No field dependencies**: Can't conditionally show/hide fields based on other values
5. **No custom validation rules**: Only schema-based validation supported

## Future Enhancements

1. **Fix Tailwind v4 styling** - Top priority
2. **Add array field support** - For list inputs
3. **Add nested object support** - For complex forms  
4. **Conditional fields** - Show/hide based on values
5. **Custom validators** - Beyond schema validation
6. **Field groups/sections** - Better organization
7. **Inline error display** - More intuitive UX
8. **Loading states** - For async operations
9. **Autosave** - Draft saving functionality
10. **Accessibility improvements** - ARIA labels, keyboard navigation
