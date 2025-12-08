import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputHtml({
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
  // Access form context - validates that component is used within SchemaForm
  useFormContext()
  
  return (
    <div className="space-y-2">
      {label && <FormLabel htmlFor={name} label={label} required={required} error={!!error} />}
      <div className={`border rounded-md overflow-hidden ${error ? 'border-destructive' : 'border-input'}`}>
        <CodeMirror
          value={value}
          height="200px"
          extensions={[html()]}
          onChange={onChange}
          onBlur={onBlur}
          editable={!disabled}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>
      {description && <FormDescription description={description} />}
      {error && <FormError name={name} error={error} />}
    </div>
  )
}
