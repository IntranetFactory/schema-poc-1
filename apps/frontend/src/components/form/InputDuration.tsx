import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputDuration({
  name,
  label,
  description,
  value = '',
  error,
  required,
  disabled,
  onChange,
  onBlur,
}: FormControlProps) {
  // Access form context - validates that component is used within SchemaForm
  useFormContext()
  return (
    <div className="space-y-2">
      {label && <FormLabel htmlFor={name} label={label} required={required} error={!!error} />}
      <Input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder="P3Y6M4DT12H30M5S"
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {description && <FormDescription description={description} />}
      {error && <FormError name={name} error={error} />}
    </div>
  )
}
