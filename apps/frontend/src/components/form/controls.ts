/**
 * Form Controls Registry
 * 
 * This file centralizes the mapping of formats to form control components.
 * When adding a new form control, you only need to make changes in this file:
 * 1. Import the new control component
 * 2. Add it to the controls map
 * 
 * Note: When a schema property has no format, its type is used as the format.
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
 * Map of format/type values to their corresponding form control components
 * 
 * Format-based controls (when schema has a format property):
 * - email, text, date, json, html
 * 
 * Type-based controls (when schema has only a type, used as format):
 * - boolean, integer, number, string
 */
export const controls: Record<string, React.ComponentType<FormControlProps>> = {
  // Format-based controls
  email: EmailInput,
  text: TextareaInput,
  date: DateInput,
  json: JsonEditor,
  html: HtmlEditor,
  
  // Type-based controls (when no format is specified)
  boolean: CheckboxInput,
  integer: NumberInput,
  number: NumberInput,
  string: TextInput,
}
