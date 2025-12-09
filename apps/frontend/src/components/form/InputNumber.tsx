import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputNumber({
  form,
  name,
  label,
  description,
  required,
  disabled,
  validators,
}: FormControlProps) {
  // Access form context - validates that component is used within SchemaForm
  useFormContext()
  
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <div className="space-y-2">
          {label && <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />}
          <Input
            id={name}
            name={name}
            type="number"
            value={field.state.value === undefined || field.state.value === null ? '' : field.state.value}
            onChange={(e) => {
              const val = e.target.value
              field.handleChange(val === '' ? undefined : Number(val))
            }}
            onBlur={field.handleBlur}
            disabled={disabled}
            aria-invalid={!!field.state.meta.errors?.[0]}
            aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : undefined}
          />
          {description && <FormDescription description={description} />}
          {field.state.meta.errors?.[0] && <FormError name={name} error={field.state.meta.errors[0]} />}
        </div>
      )}
    </form.Field>
  )
}
