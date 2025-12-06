import { useState, useCallback, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { validateSchema, validateData } from 'sem-schema'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Schema Validation Playground</h1>
        <p className="text-muted-foreground">
          Test your JSON schemas and data validation using sem-schema
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Left: Schema Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeMirror
              value={schemaText}
              height="400px"
              extensions={[json()]}
              onChange={handleSchemaChange}
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Top Right: Data Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeMirror
              value={dataText}
              height="400px"
              extensions={[json()]}
              onChange={handleDataChange}
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Bottom Left: Schema Validation Result */}
        <Card>
          <CardHeader>
            <CardTitle>Schema Validation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeMirror
              value={schemaValidation}
              height="200px"
              extensions={[json()]}
              readOnly
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Bottom Right: Data Validation Result */}
        <Card>
          <CardHeader>
            <CardTitle>Data Validation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeMirror
              value={dataValidation}
              height="200px"
              extensions={[json()]}
              readOnly
              theme="light"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
