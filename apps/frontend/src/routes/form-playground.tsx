import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { FormPlayground } from '../components/form/Playground'

interface FormPlaygroundSearch {
  schema?: string
}

export const Route = createFileRoute('/form-playground')({
  validateSearch: (search: Record<string, unknown>): FormPlaygroundSearch => {
    return {
      schema: search.schema as string | undefined,
    }
  },
  component: FormPlaygroundWrapper,
})

function FormPlaygroundWrapper() {
  const { schema: schemaUrl } = Route.useSearch()
  const [schemaJson, setSchemaJson] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!schemaUrl) {
      // No schema URL - reset to undefined (but avoid setState in effect by checking current value)
      if (schemaJson !== undefined) {
        setSchemaJson(undefined)
      }
      return
    }

    setLoading(true)

    fetch(schemaUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.statusText}`)
        }
        return response.json()
      })
      .then((data) => {
        setSchemaJson(JSON.stringify(data, null, 2))
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading schema:', err)
        setLoading(false)
      })
  }, [schemaUrl, schemaJson])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-base text-muted-foreground">
        Loading schema...
      </div>
    )
  }

  return <FormPlayground initialSchema={schemaJson} />
}
