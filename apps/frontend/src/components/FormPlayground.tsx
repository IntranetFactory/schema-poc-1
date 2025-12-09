import { useState, useCallback, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { SchemaForm } from '@/components/form'
import type { SchemaObject } from 'ajv'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const defaultSchema = `{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "required": true
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email"
    },
    "age": {
      "type": "number",
      "precision": 0,
      "title": "Age"
    }
  },
  "required": ["name"]
}`

const defaultData = `{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}`

interface FormPlaygroundProps {
  initialSchema?: string
}

export function FormPlayground({ initialSchema }: FormPlaygroundProps) {
  const [schemaText, setSchemaText] = useState(initialSchema || defaultSchema)
  const [dataText, setDataText] = useState(defaultData)
  const [schema, setSchema] = useState<SchemaObject | null>(null)
  const [data, setData] = useState<Record<string, any> | null>(null)
  const [schemaError, setSchemaError] = useState<string>('')
  const [dataError, setDataError] = useState<string>('')

  // Parse schema when schemaText changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(schemaText)
      setSchema(parsed)
      setSchemaError('')
    } catch (error) {
      setSchemaError(error instanceof Error ? error.message : String(error))
      setSchema(null)
    }
  }, [schemaText])

  // Parse data when dataText changes
  useEffect(() => {
    try {
      const parsed = JSON.parse(dataText)
      setData(parsed)
      setDataError('')
    } catch (error) {
      setDataError(error instanceof Error ? error.message : String(error))
      setData(null)
    }
  }, [dataText])

  const handleSchemaChange = useCallback((value: string) => {
    setSchemaText(value)
  }, [])

  const handleDataChange = useCallback((value: string) => {
    setDataText(value)
  }, [])

  const handleFormSubmit = useCallback((value: Record<string, any>) => {
    // Update data text with the submitted form values
    setDataText(JSON.stringify(value, null, 2))
    console.log('Form submitted:', value)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <PanelGroup direction="horizontal">
        {/* Left Panel: Schema Editor */}
        <Panel defaultSize={33} minSize={20}>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #d1d5db',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #d1d5db',
              backgroundColor: '#f9fafb'
            }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Schema
              </h2>
              {schemaError && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  {schemaError}
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <CodeMirror
                value={schemaText}
                height="100%"
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
          </div>
        </Panel>

        <PanelResizeHandle style={{
          width: '4px',
          backgroundColor: '#e5e7eb',
          cursor: 'col-resize',
          transition: 'background-color 0.2s'
        }} />

        {/* Middle Panel: Data Editor */}
        <Panel defaultSize={33} minSize={20}>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #d1d5db',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #d1d5db',
              backgroundColor: '#f9fafb'
            }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Data
              </h2>
              {dataError && (
                <div style={{
                  color: '#dc2626',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}>
                  {dataError}
                </div>
              )}
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <CodeMirror
                value={dataText}
                height="100%"
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
          </div>
        </Panel>

        <PanelResizeHandle style={{
          width: '4px',
          backgroundColor: '#e5e7eb',
          cursor: 'col-resize',
          transition: 'background-color 0.2s'
        }} />

        {/* Right Panel: Form Preview */}
        <Panel defaultSize={34} minSize={20}>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #d1d5db',
              backgroundColor: '#f9fafb'
            }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>
                Form Preview
              </h2>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              {schema && data ? (
                <SchemaForm
                  key={schemaText} // Force re-render when schema changes
                  schema={schema}
                  initialValue={data}
                  onSubmit={handleFormSubmit}
                />
              ) : (
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  {!schema && 'Invalid schema'}
                  {!data && schema && 'Invalid data'}
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
