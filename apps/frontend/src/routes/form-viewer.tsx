import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { SchemaForm, type FormMode } from '@/components/form'
import type { SchemaObject } from 'ajv'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { validateSchema } from 'sem-schema'

interface FormViewerSearch {
  schema?: string
}

export const Route = createFileRoute('/form-viewer')({
  validateSearch: (search: Record<string, unknown>): FormViewerSearch => {
    return {
      schema: search.schema as string | undefined,
    }
  },
  component: FormViewer,
})

function FormViewer() {
  const { schema: schemaUrl } = Route.useSearch()
  const [schema, setSchema] = useState<SchemaObject | null>(null)
  const [loading, setLoading] = useState(false)
  // Initialize error based on schemaUrl presence
  const [error, setError] = useState<string | null>(
    !schemaUrl ? 'No schema URL provided. Please add ?schema=<url> to the URL.' : null
  )
  const [submitResult, setSubmitResult] = useState<Record<string, unknown> | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('edit')

  useEffect(() => {
    if (!schemaUrl) {
      // Error already set in initial state
      return
    }

    setLoading(true)
    setError(null)

    fetch(schemaUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.statusText}`)
        }
        return response.json()
      })
      .then((data) => {
        // Validate schema before using it
        const validation = validateSchema(data)
        if (!validation.valid) {
          const errorMessages = validation.errors?.map(e => e.message).join(', ') || 'Unknown validation error'
          throw new Error(`Invalid schema: ${errorMessages}`)
        }
        setSchema(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      })
  }, [schemaUrl])

  const handleSubmit = (value: Record<string, any>) => {
    console.log('Form submitted with values:', value)
    setSubmitResult(value)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Schema Form Viewer</CardTitle>
          <CardDescription>
            {schemaUrl ? (
              <>Viewing form for schema: <code className="text-xs">{schemaUrl}</code></>
            ) : (
              'Add ?schema=<url> to the URL to load a schema'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <Alert>
              <AlertDescription>Loading schema...</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {schema && (
            <>
              <div className="flex items-center space-x-4 mb-6 p-4 border rounded-md bg-muted">
                <Label htmlFor="form-mode" className="font-medium min-w-fit">
                  Form Mode:
                </Label>
                <Select value={formMode} onValueChange={(value) => setFormMode(value as FormMode)}>
                  <SelectTrigger id="form-mode" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="view">View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <SchemaForm schema={schema} onSubmit={handleSubmit} formMode={formMode} />
              
              {submitResult && (
                <div className="mt-8 p-4 border rounded-md bg-muted">
                  <h3 className="text-lg font-semibold mb-2">Submitted Data (Valid)</h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(submitResult, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
