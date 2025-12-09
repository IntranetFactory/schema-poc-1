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
  required,
  disabled,
  validators,
}: FormControlProps) {
  const { form } = useFormContext()
  
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => {
        // Convert string to Date if needed, validate the date is valid
        const parseDateValue = (val: any): Date | undefined => {
          if (!val) return undefined
          if (typeof val !== 'string') return val
          const date = new Date(val)
          return Number.isNaN(date.getTime()) ? undefined : date
        }
        
        const dateValue = parseDateValue(field.state.value)

        const handleDateChange = (date: Date | undefined) => {
          // Convert Date to ISO string for form data, only if valid
          if (date && !Number.isNaN(date.getTime())) {
            field.handleChange(date.toISOString().split('T')[0])
          } else {
            field.handleChange(undefined)
          }
          field.handleBlur()
        }

        return (
          <div className="space-y-2">
            {label && <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />}
            <DatePicker
              date={dateValue}
              onDateChange={handleDateChange}
              disabled={disabled}
            />
            {description && <FormDescription description={description} />}
            {field.state.meta.errors?.[0] && <FormError name={name} error={field.state.meta.errors[0]} />}
          </div>
        )
      }}
    </form.Field>
  )
}
