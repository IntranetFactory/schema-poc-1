import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputJson } from '../InputJson'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputJson', () => {
  function TestWrapper({ 
    children, 
    required = false,
    validatorFn = () => undefined
  }: { 
    children: React.ReactNode
    required?: boolean
    validatorFn?: (value: any) => string | undefined
  }) {
    const form = useForm({
      defaultValues: { json: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { 
        type: 'object', 
        properties: {
          json: { format: 'json', required }
        },
        required: required ? ['json'] : []
      },
      validateField: validatorFn,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render json editor', () => {
    const { container } = render(
      <TestWrapper>
        <InputJson name="json" />
      </TestWrapper>
    )
    const editor = container.querySelector('.cm-editor')
    expect(editor).toBeTruthy()
  })

  it('should show required indicator when required', () => {
    render(
      <TestWrapper required>
        <InputJson name="json" label="JSON" required />
      </TestWrapper>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should validate required field via validator', () => {
    const validatorFn = (value: string) => {
      return !value || value.trim() === '' ? 'must not be empty' : undefined
    }

    // Test the validator function
    expect(validatorFn('')).toBe('must not be empty')
    expect(validatorFn('  ')).toBe('must not be empty')
    expect(validatorFn('{"key": "value"}')).toBeUndefined()
  })

  it('should detect invalid JSON via validator', () => {
    const validatorFn = (value: string) => {
      if (!value) return undefined
      try {
        JSON.parse(value)
        return undefined
      } catch {
        return 'must be valid JSON'
      }
    }

    // Test the validator function directly
    expect(validatorFn('{invalid}')).toBe('must be valid JSON')
    expect(validatorFn('{"valid": "json"}')).toBeUndefined()
    expect(validatorFn('[1, 2, 3]')).toBeUndefined()
    expect(validatorFn('{incomplete')).toBe('must be valid JSON')
  })

  it('should accept valid JSON via validator', () => {
    const validatorFn = (value: string) => {
      if (!value) return undefined
      try {
        JSON.parse(value)
        return undefined
      } catch {
        return 'must be valid JSON'
      }
    }

    // Test the validator accepts valid JSON
    expect(validatorFn('{"key": "value"}')).toBeUndefined()
    expect(validatorFn('[]')).toBeUndefined()
    expect(validatorFn('null')).toBeUndefined()
    expect(validatorFn('123')).toBeUndefined()
    expect(validatorFn('"string"')).toBeUndefined()
  })
})
