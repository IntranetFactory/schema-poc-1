import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import type { FormControlProps } from './types'

export function DateInput({
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
  // Convert string to Date if needed
  const dateValue = value ? (typeof value === 'string' ? new Date(value) : value) : undefined

  const handleDateChange = (date: Date | undefined) => {
    // Convert Date to ISO string for form data
    onChange(date ? date.toISOString().split('T')[0] : undefined)
    if (onBlur) onBlur()
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-[0.8rem] text-muted-foreground">{description}</p>
      )}
      <DatePicker
        date={dateValue}
        onDateChange={handleDateChange}
        disabled={disabled}
      />
      {error && (
        <p id={`${name}-error`} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
