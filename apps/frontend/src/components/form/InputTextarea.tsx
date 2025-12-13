import { Textarea } from '@/components/ui/textarea'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputTextarea({

  name,
  label,
  description,
  required,
  disabled,
  validators,
  readonly,
}: FormControlProps) {
  const { form } = useFormContext()
  
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
        <div className="space-y-2">
          <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />
          <Textarea
            id={name}
            name={name}
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={disabled}
            readOnly={readonly}
            rows={5}
            aria-invalid={!!field.state.meta.errors?.[0]}
            aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : undefined}
          />
          <FormDescription description={description} />
          <FormError name={name} error={field.state.meta.errors?.[0]} />
        </div>
      )}
    </form.Field>
  )
}
