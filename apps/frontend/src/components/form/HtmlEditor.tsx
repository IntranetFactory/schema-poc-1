import { Label } from '@/components/ui/label'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import type { FormControlProps } from './types'

export function HtmlEditor({
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
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name} className={error ? 'text-destructive' : ''}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className={`border rounded-md ${error ? 'border-destructive' : ''}`}>
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
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}
