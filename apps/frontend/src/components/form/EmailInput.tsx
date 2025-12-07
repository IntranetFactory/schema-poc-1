import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'

export function EmailInput({
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
      <Input
        id={name}
        name={name}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
