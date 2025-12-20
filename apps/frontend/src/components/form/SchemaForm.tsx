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
  readonly?: boolean
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
  // Check if field has inputMode: 'required'
  const inputMode = (fieldSchema as any).inputMode
  const isRequired = inputMode === 'required'
  
  // For required fields, check for empty values
  if (isRequired) {
    if (value === undefined || value === null || value === '') {
      return 'must not be empty'
    }
  }

  // For non-required fields, if value is empty/undefined, skip validation
  // This prevents enum validation errors when no selection is made on optional fields
  if (!isRequired && (value === undefined || value === null || value === '')) {
    return undefined
  }

  // Create a temporary schema for this field within an object
  const tempSchema: SchemaObject = {
    type: 'object',
    properties: {
      [fieldName]: fieldSchema
    },
    // Include required if this field is required at object level
    ...(isRequired ? { required: [fieldName] } : {})
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

export function SchemaForm({ schema, initialValue, onSubmit, readonly = false }: SchemaFormProps) {
  // Generate initial value if not provided
  const defaultValue = initialValue && Object.keys(initialValue).length > 0
    ? initialValue
    : generateDefaultValue(schema)

  const form = useForm({
    defaultValues: defaultValue,
    onSubmit: async ({ value }) => {
      // Filter out empty values for non-required fields before validation
      // This prevents enum validation errors on optional fields with no selection
      const cleanedValue: Record<string, any> = {}
      
      // Get all possible fields from schema
      const allFields = schema.properties ? Object.keys(schema.properties) : []
      
      for (const key of allFields) {
        const val = value[key]
        const propSchema = schema.properties?.[key]
        
        // Check if field has inputMode: 'required'
        const inputMode = propSchema && typeof propSchema === 'object' ? (propSchema as any).inputMode : undefined
        const isRequired = inputMode === 'required'
        
        // Include the field if it's required OR if it has a non-empty value
        if (isRequired || (val !== undefined && val !== null && val !== '')) {
          cleanedValue[key] = val
        }
      }
      
      // Validate the entire form with cleaned data
      const result = validateData(cleanedValue, schema)
      
      if (!result.valid) {
        // Set errors on all fields with validation issues
        if (result.errors) {
          result.errors.forEach((error: any) => {
            // Remove leading slash from instancePath to get field name
            const fieldPath = error.instancePath.startsWith('/') 
              ? error.instancePath.substring(1) 
              : error.instancePath
            
            if (fieldPath) {
              form.setFieldMeta(fieldPath, (meta) => ({
                ...meta,
                errors: [error.message],
                errorMap: {
                  ...meta.errorMap,
                  onSubmit: error.message,
                }
              }))
            }
          })
        }
        // Do not call onSubmit callback when validation fails
        return
      }
      
      // Only call onSubmit when validation passes (with cleaned data)
      onSubmit?.(cleanedValue)
    },
  })

  if (!schema.properties || typeof schema.properties !== 'object') {
    return <div>Invalid schema: no properties defined</div>
  }

  const properties = schema.properties as Record<string, SchemaObject>

  // Create context value for form controls - includes form instance
  const formContextValue = {
    form,
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
        const hasEnum = 'enum' in propSchema && Array.isArray((propSchema as any).enum)
        const label = propSchema.title || key
        const description = propSchema.description

        // Use format if available, otherwise check for enum, otherwise use type as format
        const controlKey = format || (hasEnum ? 'enum' : type) as string
        const ControlComponent = controls[controlKey] || InputText

        // Get inputMode from schema (defaults to 'default' if not specified)
        let inputMode: 'default' | 'required' | 'readonly' | 'disabled' | 'hidden' = 
          (propSchema as any).inputMode || 'default'
        
        // Form-level readonly prop overrides schema-level inputMode (except for hidden)
        if (readonly && inputMode !== 'hidden') {
          inputMode = 'readonly'
        }

        // Skip validation for readonly, disabled, and hidden fields
        const shouldValidate = inputMode === 'default' || inputMode === 'required'

        return (
          <ControlComponent
            key={key}
            name={key}
            label={label}
            description={description}
            inputMode={inputMode}
            validators={shouldValidate ? {
              onBlur: ({ value }) => validateField(value, propSchema, key, schema),
              onSubmit: ({ value }) => validateField(value, propSchema, key, schema),
            } : undefined}
          />
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
