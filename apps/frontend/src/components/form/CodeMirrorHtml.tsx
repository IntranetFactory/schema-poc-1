import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'

interface CodeMirrorHtmlProps {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  disabled?: boolean
}

export default function CodeMirrorHtml({ value, onChange, onBlur, disabled }: CodeMirrorHtmlProps) {
  return (
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
  )
}
