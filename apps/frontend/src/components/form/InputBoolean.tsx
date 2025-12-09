import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormError } from './FormError'

export function InputBoolean({
  form,
  name,
  label,
  description,
  required,
  disabled,
  validators,
}: FormControlProps) {
  // Access form context - validates that component is used within SchemaForm
  useFormContext()
  
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
              {label && (
                <Label
                  htmlFor={name}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    field.state.meta.errors?.[0] ? 'text-destructive' : ''
                  }`}
                >
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </Label>
              )}
              {description && (
                <p id={`${name}-description`} className="text-[0.8rem] text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
          {field.state.meta.errors?.[0] && <FormError name={name} error={field.state.meta.errors[0]} />}
        </div>
      )}
    </form.Field>
  )
}
