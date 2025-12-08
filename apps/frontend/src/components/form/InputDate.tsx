import { DatePicker } from '@/components/ui/date-picker'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputDate({
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
  
  // Convert string to Date if needed
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : undefined

  const handleDateChange = (date: Date | undefined) => {
    // Convert Date to ISO string for form data
    onChange(date ? date.toISOString().split('T')[0] : undefined)
    if (onBlur) onBlur()
  }

  return (
    <div className="space-y-2">
      {label && <FormLabel htmlFor={name} label={label} required={required} error={!!error} />}
      <DatePicker
        date={dateValue}
        onDateChange={handleDateChange}
        disabled={disabled}
      />
      {description && <FormDescription description={description} />}
      {error && <FormError name={name} error={error} />}
    </div>
  )
}
