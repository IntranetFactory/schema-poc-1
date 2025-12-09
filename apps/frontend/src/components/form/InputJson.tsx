import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import type { FormControlProps } from './types'
import { useFormContext } from './FormContext'
import { FormLabel } from './FormLabel'
import { FormDescription } from './FormDescription'
import { FormError } from './FormError'

export function InputJson({

  name,
  label,
  description,
  required,
  disabled,
  validators,
}: FormControlProps) {
  const { form } = useFormContext()
  
  return (
    <form.Field name={name} validators={validators}>
      {(field: any) => {
        // Ensure value is a string (prettify if it's an object)
        const stringValue = typeof field.state.value === 'string' 
          ? field.state.value 
          : field.state.value 
            ? JSON.stringify(field.state.value, null, 2) 
            : ''

        return (
          <div className="space-y-2">
            {label && <FormLabel htmlFor={name} label={label} required={required} error={!!field.state.meta.errors?.[0]} />}
            <div className={`border rounded-md overflow-hidden ${field.state.meta.errors?.[0] ? 'border-destructive' : 'border-input'}`}>
              <CodeMirror
                value={stringValue}
                height="200px"
                extensions={[json()]}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
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
            {field.state.meta.errors?.[0] && <FormError name={name} error={field.state.meta.errors[0]} />}
          </div>
        )
      }}
    </form.Field>
  )
}
