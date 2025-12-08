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
import { InputDateTime } from './InputDateTime'
import { InputTime } from './InputTime'
import { InputDuration } from './InputDuration'
import { InputIdnEmail } from './InputIdnEmail'
import { InputHostname } from './InputHostname'
import { InputIdnHostname } from './InputIdnHostname'
import { InputIpv4 } from './InputIpv4'
import { InputIpv6 } from './InputIpv6'
import { InputUri } from './InputUri'
import { InputUriReference } from './InputUriReference'
import { InputIri } from './InputIri'
import { InputIriReference } from './InputIriReference'
import { InputUuid } from './InputUuid'
import { InputUriTemplate } from './InputUriTemplate'
import { InputJsonPointer } from './InputJsonPointer'
import { InputRelativeJsonPointer } from './InputRelativeJsonPointer'
import { InputRegex } from './InputRegex'
import type { FormControlProps } from './types'

/**
 * Map of format/type values to their corresponding form control components
 * 
 * Format-based controls (when schema has a format property):
 * - Standard JSON Schema 2020-12 formats: date-time, time, date, duration
 * - Email formats: email, idn-email
 * - Hostname formats: hostname, idn-hostname
 * - IP address formats: ipv4, ipv6
 * - URI formats: uri, uri-reference, iri, iri-reference, uri-template
 * - Resource identifiers: uuid, json-pointer, relative-json-pointer
 * - Pattern: regex
 * - Custom formats: text, json, html
 * 
 * Type-based controls (when schema has only a type, used as format):
 * - boolean, integer, number, string
 */
export const controls: Record<string, React.ComponentType<FormControlProps>> = {
  // Standard JSON Schema 2020-12 Time formats
  'date-time': InputDateTime,
  time: InputTime,
  date: DateInput,
  duration: InputDuration,
  
  // Email formats
  email: EmailInput,
  'idn-email': InputIdnEmail,
  
  // Hostname formats
  hostname: InputHostname,
  'idn-hostname': InputIdnHostname,
  
  // IP address formats
  ipv4: InputIpv4,
  ipv6: InputIpv6,
  
  // URI formats
  uri: InputUri,
  'uri-reference': InputUriReference,
  iri: InputIri,
  'iri-reference': InputIriReference,
  'uri-template': InputUriTemplate,
  
  // Resource identifier formats
  uuid: InputUuid,
  'json-pointer': InputJsonPointer,
  'relative-json-pointer': InputRelativeJsonPointer,
  
  // Pattern format
  regex: InputRegex,
  
  // Custom formats
  text: TextareaInput,
  json: JsonEditor,
  html: HtmlEditor,
  
  // Type-based controls (when no format is specified)
  boolean: CheckboxInput,
  integer: NumberInput,
  number: NumberInput,
  string: TextInput,
}
