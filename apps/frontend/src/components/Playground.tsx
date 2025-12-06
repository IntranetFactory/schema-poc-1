import { useState, useCallback, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { validateSchema, validateData } from 'sem-schema'

const defaultSchema = `{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "required": true
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
      setSchemaValidation(JSON.stringify({ valid: result }, null, 2))
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
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Schema Validation Playground</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Test your JSON schemas and data validation using sem-schema
        </p>
      </div>
      
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', overflow: 'hidden' }}>
        {/* Top Left: Schema Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Schema</h2>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeMirror
              value={schemaText}
              height="100%"
              extensions={[json()]}
              onChange={handleSchemaChange}
              theme="light"
            />
          </div>
        </div>

        {/* Top Right: Data Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Data</h2>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeMirror
              value={dataText}
              height="100%"
              extensions={[json()]}
              onChange={handleDataChange}
              theme="light"
            />
          </div>
        </div>

        {/* Bottom Left: Schema Validation Result */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Schema Validation Result</h2>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeMirror
              value={schemaValidation}
              height="100%"
              extensions={[json()]}
              readOnly
              theme="light"
            />
          </div>
        </div>

        {/* Bottom Right: Data Validation Result */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: '600' }}>Data Validation Result</h2>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeMirror
              value={dataValidation}
              height="100%"
              extensions={[json()]}
              readOnly
              theme="light"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
