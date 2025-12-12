import { useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

function EnumFieldInner({
  field,
  name,
  label,
  description,
  required,
  disabled,
  readonly,
  enumValues,
  form,
}: {
  field: any
  name: string
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  enumValues: string[]
  form: any
}) {
  // Get the actual current value from form state values (not field state which may be stale)
  const formStateValue = form.state.values[name]
  
  // Initialize field value from form state if not set
  useEffect(() => {
    if (!field.state.value && formStateValue && enumValues.includes(formStateValue)) {
      field.handleChange(formStateValue)
    }
  }, [formStateValue, field.state.value])
  
  // Use the form state value if field value is not set properly
  const currentValue = field.state.value || formStateValue || ''
  
  // For Radix Select: only pass non-empty strings that are valid enum values
  const selectValue = currentValue && enumValues.includes(currentValue) ? currentValue : undefined
  
  return (
    <div className="space-y-2">
      <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />
      <Select
        value={selectValue}
        onValueChange={(value) => {
          field.handleChange(value)
          // Clear any errors when a valid selection is made
          if (value && enumValues.includes(value)) {
            form.setFieldMeta(name, (meta) => ({
              ...meta,
              errors: [],
            }))
          }
        }}
        disabled={disabled || readonly}
      >
        <SelectTrigger
          id={name}
          aria-invalid={!!field.state.meta.errors?.[0]}
          aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={required ? "Select an option *" : "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {enumValues.map((value: string) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormDescription description={description} />
      <FormError name={name} error={field.state.meta.errors?.[0]} />
    </div>
  )
}

export function InputEnum({
  name,
  label,
  description,
  required,
  disabled,
  readonly,
  validators,
}: FormControlProps) {
  const { form, schema } = useFormContext()
  
  // Get enum values from schema
  const fieldSchema = schema.properties?.[name] as any
  const enumValues = fieldSchema?.enum || []
  
  // Get the default value from form state
  const defaultValue = form.state.values[name]
  
  return (
    <form.Field 
      name={name} 
      defaultValue={defaultValue}
      validators={validators}
    >
      {(field: any) => (
        <EnumFieldInner
          field={field}
          name={name}
          label={label}
          description={description}
          required={required}
          disabled={disabled}
          readonly={readonly}
          enumValues={enumValues}
          form={form}
        />
      )}
    </form.Field>
  )
}
