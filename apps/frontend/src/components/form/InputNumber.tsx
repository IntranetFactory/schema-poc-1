import { Input } from '@/components/ui/input'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputNumber({
  name,
  label,
  description,
  value,
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
        type="number"
        value={value === undefined || value === null ? '' : value}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === '' ? undefined : Number(val))
        }}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {description && <FormDescription description={description} />}
      {error && <FormError name={name} error={error} />}
    </div>
  )
}
