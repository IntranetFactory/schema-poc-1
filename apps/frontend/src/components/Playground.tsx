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
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Schema Validation Playground</h1>
        <p className="text-sm text-muted-foreground">
          Test your JSON schemas and data validation using sem-schema
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-0">
        {/* Top Left: Schema Editor */}
        <Card className="rounded-none border-r border-b">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm">Schema</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-3rem)]">
            <CodeMirror
              value={schemaText}
              height="100%"
              extensions={[json()]}
              onChange={handleSchemaChange}
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Top Right: Data Editor */}
        <Card className="rounded-none border-b">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm">Data</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-3rem)]">
            <CodeMirror
              value={dataText}
              height="100%"
              extensions={[json()]}
              onChange={handleDataChange}
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Bottom Left: Schema Validation Result */}
        <Card className="rounded-none border-r">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm">Schema Validation Result</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-3rem)]">
            <CodeMirror
              value={schemaValidation}
              height="100%"
              extensions={[json()]}
              readOnly
              theme="light"
            />
          </CardContent>
        </Card>

        {/* Bottom Right: Data Validation Result */}
        <Card className="rounded-none">
          <CardHeader className="py-2 px-4 border-b">
            <CardTitle className="text-sm">Data Validation Result</CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-3rem)]">
            <CodeMirror
              value={dataValidation}
              height="100%"
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
