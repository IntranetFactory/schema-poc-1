import { Checkbox } from '@/components/ui/checkbox'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputBoolean({

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
          <div className="flex items-start space-x-3">
            <Checkbox
              id={name}
              name={name}
              checked={field.state.value || false}
              onCheckedChange={field.handleChange}
              onBlur={field.handleBlur}
              disabled={disabled}
              aria-invalid={!!field.state.meta.errors?.[0]}
              aria-describedby={field.state.meta.errors?.[0] ? `${name}-error` : description ? `${name}-description` : undefined}
            />
            <div className="grid gap-1.5 leading-none">
              <FormLabel htmlFor={name} label={label} required={false} error={!!field.state.meta.errors?.[0]} />
              <FormDescription description={description} />
            </div>
          </div>
          <FormError name={name} error={field.state.meta.errors?.[0]} />
        </div>
      )}
    </form.Field>
  )
}
