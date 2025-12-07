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
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-1">Schema Validation Playground</h1>
        <p className="text-sm text-gray-500">
          Test your JSON schemas and data validation using sem-schema
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-2 grid-rows-2 overflow-hidden">
        {/* Top Left: Schema Editor */}
        <div className="flex flex-col border-r border-b border-gray-200 overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold">Schema</h2>
          </div>
          <div className="flex-1 overflow-hidden">
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
        <div className="flex flex-col border-b border-gray-200 overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold">Data</h2>
          </div>
          <div className="flex-1 overflow-hidden">
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
        <div className="flex flex-col border-r border-gray-200 overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold">Schema Validation Result</h2>
          </div>
          <div className="flex-1 overflow-hidden">
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
        <div className="flex flex-col overflow-hidden">
          <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold">Data Validation Result</h2>
          </div>
          <div className="flex-1 overflow-hidden">
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
