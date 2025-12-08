import { useForm } from '@tanstack/react-form'
import { validateData } from 'sem-schema'
import { controls } from './controls'
import { Button } from '@/components/ui/button'
import type { SchemaObject } from 'ajv'
import { InputText } from './InputText'
import { FormProvider } from './FormContext'

interface SchemaFormProps {
  schema: SchemaObject
  initialValue?: Record<string, any>
  onSubmit?: (value: Record<string, any>) => void
}

/**
 * Generate default values from schema
 */
function generateDefaultValue(schema: SchemaObject): Record<string, any> {
  const defaults: Record<string, any> = {}

  if (schema.properties && typeof schema.properties === 'object') {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (typeof propSchema !== 'object' || propSchema === null) continue

      // Check if default value is provided
      if ('default' in propSchema) {
        defaults[key] = (propSchema as any).default
      } else {
        // Generate default based on type
        const type = (propSchema as any).type || ((propSchema as any).format ? 'string' : undefined)
        
        if (type === 'boolean') {
          defaults[key] = false
        } else if (type === 'number' || type === 'integer') {
          defaults[key] = undefined
        } else if (type === 'string') {
          defaults[key] = ''
        } else if (type === 'array') {
          defaults[key] = []
        } else if (type === 'object') {
          defaults[key] = {}
        }
      }
    }
  }

  return defaults
}

/**
 * Validate a single field value against its schema
 * 
 * @param value - The value to validate
 * @param fieldSchema - The JSON Schema for this specific field
 * @param fieldName - The name of the field being validated
 * @param fullSchema - The complete object schema (used to check required fields)
 * @returns Error message if validation fails, undefined if valid
 */
function validateField(value: any, fieldSchema: SchemaObject, fieldName: string, fullSchema: SchemaObject): string | undefined {
  // Create a temporary schema for this field within an object
  const tempSchema: SchemaObject = {
    type: 'object',
    properties: {
      [fieldName]: fieldSchema
    },
    // Include required if this field is required at object level
    ...(fullSchema.required && Array.isArray(fullSchema.required) && fullSchema.required.includes(fieldName)
      ? { required: [fieldName] }
      : {})
  }

  const tempData = { [fieldName]: value }
  const result = validateData(tempData, tempSchema)

  if (!result.valid && result.errors) {
    // Find the first error for this field
    const fieldError = result.errors.find((err: any) => 
      err.instancePath === `/${fieldName}` || err.instancePath === ''
    )
    return fieldError ? fieldError.message : 'Validation error'
  }

  return undefined
}

export function SchemaForm({ schema, initialValue, onSubmit }: SchemaFormProps) {
  // Generate initial value if not provided
  const defaultValue = initialValue && Object.keys(initialValue).length > 0
    ? initialValue
    : generateDefaultValue(schema)

  const form = useForm({
    defaultValues: defaultValue,
    onSubmit: async ({ value }) => {
      // Validate the entire form
      const result = validateData(value, schema)
      
      if (result.valid) {
        onSubmit?.(value)
      } else {
        // Set errors on fields
        if (result.errors) {
          result.errors.forEach((error: any) => {
            const fieldPath = error.instancePath.replace('/', '')
            if (fieldPath) {
              form.setFieldMeta(fieldPath, (meta) => ({
                ...meta,
                errors: [error.message],
              }))
            }
          })
        }
      }
    },
  })

  if (!schema.properties || typeof schema.properties !== 'object') {
    return <div>Invalid schema: no properties defined</div>
  }

  const properties = schema.properties as Record<string, SchemaObject>
  const requiredFields = Array.isArray(schema.required) ? schema.required : []

  // Create context value for form controls
  const formContextValue = {
    schema,
    validateField: (value: any, fieldName: string) => {
      const fieldSchema = properties[fieldName]
      if (!fieldSchema) return undefined
      return validateField(value, fieldSchema, fieldName, schema)
    },
  }

  return (
    <FormProvider value={formContextValue}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
      {Object.entries(properties).map(([key, propSchema]) => {
        if (typeof propSchema !== 'object') return null

        const type = propSchema.type
        const format = propSchema.format
        const isRequired = (propSchema as any).required === true || requiredFields.includes(key)
        const label = propSchema.title || key
        const description = propSchema.description

        return (
          <form.Field
            key={key}
            name={key}
            validators={{
              onBlur: ({ value }) => validateField(value, propSchema, key, schema),
            }}
          >
            {(field) => {
              const commonProps = {
                name: key,
                label,
                description,
                value: field.state.value,
                error: field.state.meta.errors?.[0],
                required: isRequired,
                disabled: false,
                onChange: field.handleChange,
                onBlur: field.handleBlur,
              }

              // Use format if available, otherwise use type as format
              const controlKey = (format || type) as string
              const ControlComponent = controls[controlKey] || InputText
              return <ControlComponent {...commonProps} />
            }}
          </form.Field>
        )
      })}

      <div className="flex gap-4">
        <Button type="submit">Submit</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
        >
          Reset
        </Button>
      </div>
    </form>
    </FormProvider>
  )
}
