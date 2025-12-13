import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputIpv4({
  name,
  label,
  description,
  inputMode = 'default',
  validators,
}: FormControlProps) {
  const { form } = useFormContext()
  
  
  // Derive props from inputMode
  const required = inputMode === 'required'
  const readonly = inputMode === 'readonly'
  const disabled = inputMode === 'disabled'
  const hidden = inputMode === 'hidden'
  
  if (hidden) {
    return null
  }
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => (
    <div className="space-y-2">
      <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />
      <Input
        id={name}
        name={name}
        type="text"
        value={field.state.value || ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
            readOnly={readonly}
        placeholder="192.168.1.1"
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
