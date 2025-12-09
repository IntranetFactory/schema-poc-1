import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputDateTime({

  name,
  label,
  description,
  required,
  disabled,
  validators,
}: FormControlProps) {
  const { form } = useFormContext()
  
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <div className="space-y-2">
          {label && <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />}
          <Input
            id={name}
            name={name}
            type="datetime-local"
            // Convert ISO 8601 to datetime-local format by removing timezone and milliseconds
            value={field.state.value ? field.state.value.split('.')[0].replace('Z', '') : ''}
            onChange={(e) => {
              if (!e.target.value) {
                field.handleChange('')
                return
              }
              // datetime-local input returns format: YYYY-MM-DDTHH:mm
              const date = new Date(e.target.value)
              // Validate date is valid before converting to ISO string
              field.handleChange(Number.isNaN(date.getTime()) ? '' : date.toISOString())
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
