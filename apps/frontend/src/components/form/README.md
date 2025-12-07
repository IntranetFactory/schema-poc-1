# Form Components

This directory contains form components for rendering dynamic forms based on JSON Schema with validation powered by the sem-schema package.

## Overview

The form engine consists of:
1. **Form Controls** - Individual input components for each data type and format
2. **SchemaForm** - Main component that renders a complete form from a JSON Schema
3. **FormControlProps** - Shared interface for all form controls

## Form Controls

Each form control provides a consistent interface defined in `types.ts`:

### Available Controls

- **TextInput** - Basic text input (default for string type)
- **EmailInput** - Email input with validation (format: "email")
- **NumberInput** - Number/integer input with proper type handling
- **TextareaInput** - Multi-line text input (format: "text")
- **CheckboxInput** - Boolean checkbox input
- **DateInput** - Date picker with calendar UI (format: "date")
- **HtmlEditor** - CodeMirror editor with HTML syntax highlighting (format: "html")
- **JsonEditor** - CodeMirror editor with JSON syntax highlighting (format: "json")

### Common Props

All form controls accept the following props:

```typescript
interface FormControlProps {
  name: string           // Field name
  label?: string         // Display label
  description?: string   // Help text
  value: any            // Current value
  error?: string        // Validation error message
  required?: boolean    // Whether field is required
  disabled?: boolean    // Whether field is disabled
  onChange: (value: any) => void  // Value change handler
  onBlur?: () => void   // Blur event handler
}
```

## SchemaForm Component

The `SchemaForm` component automatically renders a form based on a JSON Schema.

### Usage

```tsx
import { SchemaForm } from '@/components/form'

function MyComponent() {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', required: true },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer' }
    },
    required: ['name', 'email']
  }

  const handleSubmit = (value) => {
    console.log('Form submitted:', value)
  }

  return (
    <SchemaForm 
      schema={schema} 
      onSubmit={handleSubmit} 
    />
  )
}
```

### Features

- **Automatic Field Rendering** - Selects appropriate control based on type and format
- **Field-Level Validation** - Validates on blur using AJV and sem-schema
- **Form-Level Validation** - Validates all fields on submit
- **Default Values** - Generates defaults from schema or uses provided initial values
- **Error Display** - Shows validation errors below each field
- **Required Fields** - Marks required fields with asterisk

### Field Type Mapping

The SchemaForm automatically maps schema types/formats to appropriate controls:

| Type/Format | Control |
|------------|---------|
| type: "boolean" | CheckboxInput |
| type: "integer" or "number" | NumberInput |
| format: "json" | JsonEditor |
| format: "html" | HtmlEditor |
| format: "text" | TextareaInput |
| format: "email" | EmailInput |
| format: "date" | DateInput |
| default (type: "string") | TextInput |

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

## Form Viewer Route

The `/form-viewer` route demonstrates the form engine:

```
http://localhost:5173/form-viewer?schema=http://localhost:5173/schemas/person.schema.json
```

This route:
1. Fetches the schema from the provided URL
2. Renders the SchemaForm
3. Validates form on submit
4. Displays submitted data (does not actually submit)

## Examples

See the form viewer at `/form-viewer` with various schema URLs:

- Person Schema: `?schema=http://localhost:5173/schemas/person.schema.json`
- Product Schema: `?schema=http://localhost:5173/schemas/product.schema.json`
- Blog Post Schema: `?schema=http://localhost:5173/schemas/blogpost.schema.json`

## Adding New Form Controls

To add a new form control:

1. Create a new file in this directory (e.g., `MyInput.tsx`)
2. Implement the `FormControlProps` interface
3. Export it from `index.ts`
4. Update `SchemaForm.tsx` to use your control based on type/format
