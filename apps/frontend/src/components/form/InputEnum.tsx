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
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <div className="space-y-2">
          <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />
          <Select
            value={field.state.value ?? ''}
            onValueChange={field.handleChange}
            disabled={disabled || readonly}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!field.state.meta.errors?.[0]}
              aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : undefined}
            >
              <SelectValue placeholder="Select an option" />
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
      )}
    </form.Field>
  )
}
