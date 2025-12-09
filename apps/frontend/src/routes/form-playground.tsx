import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { FormPlayground } from '../components/FormPlayground'

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
  const [initialSchema, setInitialSchema] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!schemaUrl) {
      setInitialSchema(undefined)
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
        setInitialSchema(JSON.stringify(data, null, 2))
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading schema:', err)
        setLoading(false)
      })
  }, [schemaUrl])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1rem',
        color: '#6b7280'
      }}>
        Loading schema...
      </div>
    )
  }

  return <FormPlayground initialSchema={initialSchema} />
}
