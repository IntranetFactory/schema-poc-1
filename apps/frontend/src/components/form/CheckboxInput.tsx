import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'

export function CheckboxInput({
  name,
  label,
  description,
  value = false,
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
      <div className="flex items-start space-x-3">
        <Checkbox
          id={name}
          name={name}
          checked={value}
          onCheckedChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : description ? `${name}-description` : undefined}
        />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <Label
              htmlFor={name}
              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                error ? 'text-destructive' : ''
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
      {error && (
        <p id={`${name}-error`} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
