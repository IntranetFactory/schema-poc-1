import { Label } from '@/components/ui/label'

interface FormLabelProps {
  htmlFor: string
  label: string
  required?: boolean
  error?: boolean
}

export function FormLabel({ htmlFor, label, required, error }: FormLabelProps) {
  return (
    <Label htmlFor={htmlFor} className={error ? 'text-destructive' : ''}>
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  )
}
