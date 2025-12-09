import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputIpv6({

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
        type="text"
        value={field.state.value || ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
        placeholder="2001:0db8:85a3::8a2e:0370:7334"
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
