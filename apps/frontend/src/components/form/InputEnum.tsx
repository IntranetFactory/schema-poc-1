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

interface EnumFieldInnerProps extends Omit<FormControlProps, 'validators'> {
  field: any
  enumValues: string[]
  form: any
}

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
}: EnumFieldInnerProps) {
  // Get the actual value - prefer field.state.value, fallback to empty string
  const currentValue = field.state.value ?? ''
  
  // Only pass valid enum values to Select, otherwise undefined for placeholder
  const selectValue = currentValue && enumValues.includes(currentValue) ? currentValue : undefined
  
  return (
    <div className="space-y-2">
      <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />
      <Select
        // Key prop forces re-render when value changes - required for Radix UI Select with tanstack-form
        // See: https://stackoverflow.com/a/78746413
        key={`${name}-${currentValue}`}
        value={selectValue}
        onValueChange={(value) => {
          // Clear errors first, then change value
          // This ensures that selecting a valid value always clears validation errors
          field.setMeta((meta: any) => ({
            ...meta,
            errors: [],
            errorMap: {},
          }))
          field.handleChange(value)
        }}
        disabled={disabled || readonly}
      >
        <SelectTrigger
          id={name}
          aria-invalid={!!field.state.meta.errors?.[0]}
          aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : undefined}
          onBlur={() => field.handleBlur()}
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
  
  return (
    <form.Field 
      name={name}
      // Note: defaultValue is handled by the form's defaultValues from useForm
      // Do not set defaultValue here as it can cause issues with Radix UI Select
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
