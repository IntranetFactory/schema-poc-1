import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputUri({

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
      <Input
        id={name}
        name={name}
        type="url"
        value={field.state.value || ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
            readOnly={readonly}
        placeholder="https://example.com/path"
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
