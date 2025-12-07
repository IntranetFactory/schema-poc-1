/**
 * Common interface for all form control components
 */
export interface FormControlProps {
  name: string
  label?: string
  description?: string
  value: any
  error?: string
  required?: boolean
  disabled?: boolean
  onChange: (value: any) => void
  onBlur?: () => void
}
