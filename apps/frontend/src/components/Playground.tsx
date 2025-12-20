import { useState, useCallback, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { validateSchema, validateData } from 'sem-schema'

const defaultSchema = `{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "inputMode": "required"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "number",
      "precision": 0
    }
  },
  "required": ["name"]
}`

const defaultData = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`

export function Playground() {
  const [schemaText, setSchemaText] = useState(defaultSchema)
  const [dataText, setDataText] = useState(defaultData)
  const [schemaValidation, setSchemaValidation] = useState<string>('')
  const [dataValidation, setDataValidation] = useState<string>('')

  const handleSchemaChange = useCallback((value: string) => {
    setSchemaText(value)
    try {
      const schema = JSON.parse(value)
      const result = validateSchema(schema)
      setSchemaValidation(JSON.stringify(result, null, 2))
    } catch (error) {
      setSchemaValidation(JSON.stringify({ 
        valid: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, null, 2))
    }
  }, [])

  const handleDataChange = useCallback((value: string) => {
    setDataText(value)
    try {
      const data = JSON.parse(value)
      const schema = JSON.parse(schemaText)
      const result = validateData(data, schema)
      setDataValidation(JSON.stringify(result, null, 2))
    } catch (error) {
      setDataValidation(JSON.stringify({ 
        valid: false, 
        error: error instanceof Error ? error.message : String(error) 
      }, null, 2))
    }
  }, [schemaText])

  // Initial validation
  useEffect(() => {
    handleSchemaChange(schemaText)
    handleDataChange(dataText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: 0
    }}>
      {/* Top Left: Schema Editor */}
      <div style={{ border: '1px solid #d1d5db', padding: '1rem', overflow: 'auto' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Schema</h2>
        </div>
        <CodeMirror
          value={schemaText}
          height="calc(50vh - 3rem)"
          extensions={[json()]}
          onChange={handleSchemaChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>

      {/* Top Right: Data Editor */}
      <div style={{ border: '1px solid #d1d5db', padding: '1rem', overflow: 'auto' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Data</h2>
        </div>
        <CodeMirror
          value={dataText}
          height="calc(50vh - 3rem)"
          extensions={[json()]}
          onChange={handleDataChange}
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: true,
          }}
        />
      </div>

      {/* Bottom Left: Schema Validation Result */}
      <div style={{ border: '1px solid #d1d5db', padding: '1rem', overflow: 'auto' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Schema Validation Result</h2>
        </div>
        <CodeMirror
          value={schemaValidation}
          height="calc(50vh - 3rem)"
          extensions={[json()]}
          readOnly
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: false,
          }}
        />
      </div>

      {/* Bottom Right: Data Validation Result */}
      <div style={{ border: '1px solid #d1d5db', padding: '1rem', overflow: 'auto' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Data Validation Result</h2>
        </div>
        <CodeMirror
          value={dataValidation}
          height="calc(50vh - 3rem)"
          extensions={[json()]}
          readOnly
          theme="light"
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: false,
          }}
        />
      </div>
    </div>
  )
}
