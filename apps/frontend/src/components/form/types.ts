/**
 * Common interface for all form control components
 * Each control wraps itself with form.Field and manages its own state
 * Form instance is accessed via useFormContext() hook
 */
export interface FormControlProps {
  name: string
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  validators?: {
    onChange?: ({ value }: { value: any }) => string | undefined
    onBlur?: ({ value }: { value: any }) => string | undefined
  }
}
