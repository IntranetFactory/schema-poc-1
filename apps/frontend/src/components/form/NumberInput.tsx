import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormControlProps } from './types'

export function NumberInput({
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
        type="number"
        value={value === undefined || value === null ? '' : value}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === '' ? undefined : Number(val))
        }}
        onBlur={onBlur}
        disabled={disabled}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
