import { Label } from '@/components/ui/label'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import type { FormControlProps } from './types'

export function JsonEditor({
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
  // Ensure value is a string (prettify if it's an object)
  const stringValue = typeof value === 'string' 
    ? value 
    : value 
      ? JSON.stringify(value, null, 2) 
      : ''

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-[0.8rem] text-muted-foreground">{description}</p>
      )}
      <div className={`border rounded-md overflow-hidden ${error ? 'border-destructive' : 'border-input'}`}>
        <CodeMirror
          value={stringValue}
          height="200px"
          extensions={[json()]}
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
      {error && (
        <p id={`${name}-error`} className="text-[0.8rem] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
