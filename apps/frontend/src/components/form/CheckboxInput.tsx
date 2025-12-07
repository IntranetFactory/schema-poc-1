import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'

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
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          name={name}
          checked={value}
          onCheckedChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
        {label && (
          <Label
            htmlFor={name}
            className={`${error ? 'text-destructive' : ''} cursor-pointer`}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground ml-6">{description}</p>
      )}
      {error && <p className="text-sm font-medium text-destructive ml-6">{error}</p>}
    </div>
  )
}
