import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputNumber } from './InputNumber'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputNumber', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render number input type', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { age: undefined },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputNumber form={form} name="age" />
        </TestWrapper>
      )
    }

    const { container } = render(<FormWithField />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should handle number values', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { age: 42 },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputNumber form={form} name="age" />
        </TestWrapper>
      )
    }

    const { container } = render(<FormWithField />)
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('42')
  })
})
