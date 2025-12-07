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
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? 'border-destructive' : ''}
        rows={5}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
