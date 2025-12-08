/**
 * Form Controls Registry
 * 
 * This file centralizes the mapping of schema types and formats to form control components.
 * When adding a new form control, you only need to make changes in this file:
 * 1. Import the new control component
 * 2. Add it to the formatControls or typeControls map
 */

import { TextInput } from './TextInput'
import { EmailInput } from './EmailInput'
import { NumberInput } from './NumberInput'
import { TextareaInput } from './TextareaInput'
import { CheckboxInput } from './CheckboxInput'
import { DateInput } from './DateInput'
import { JsonEditor } from './JsonEditor'
import { HtmlEditor } from './HtmlEditor'
import type { FormControlProps } from './types'

/**
 * Map of format values to their corresponding form control components
 */
export const formatControls: Record<string, React.ComponentType<FormControlProps>> = {
  email: EmailInput,
  text: TextareaInput,
  date: DateInput,
  json: JsonEditor,
  html: HtmlEditor,
}

/**
 * Map of type values to their corresponding form control components
 */
export const typeControls: Record<string, React.ComponentType<FormControlProps>> = {
  boolean: CheckboxInput,
  integer: NumberInput,
  number: NumberInput,
  string: TextInput, // Default for string type
}

/**
 * Get the appropriate form control component for a given schema property
 * 
 * @param type - The JSON Schema type (e.g., 'string', 'number', 'boolean')
 * @param format - The JSON Schema format (e.g., 'email', 'date', 'json')
 * @returns The corresponding React component for the form control
 */
export function getFormControl(
  type?: string,
  format?: string
): React.ComponentType<FormControlProps> {
  // Format takes precedence over type
  if (format && format in formatControls) {
    return formatControls[format]
  }
  
  // Fall back to type-based control
  if (type && type in typeControls) {
    return typeControls[type]
  }
  
  // Default to text input
  return TextInput
}
