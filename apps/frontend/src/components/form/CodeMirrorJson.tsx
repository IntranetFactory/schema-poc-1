import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'

interface CodeMirrorJsonProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  disabled?: boolean
}

export default function CodeMirrorJson({ value, onChange, onBlur, disabled }: CodeMirrorJsonProps) {
  return (
    <CodeMirror
      value={value}
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
  )
}
