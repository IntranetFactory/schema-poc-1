/**
 * Common interface for all form control components
 * Each control wraps itself with form.Field and manages its own state
 */
export interface FormControlProps {
  form: any // FormApi from TanStack Form
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
