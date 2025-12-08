import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'

export function TextareaInput({
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
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        rows={5}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
