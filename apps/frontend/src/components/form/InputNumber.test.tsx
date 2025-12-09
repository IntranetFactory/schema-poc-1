import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputNumber } from './InputNumber'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputNumber', () => {
  function TestWrapper({ children, defaultValue }: { children: React.ReactNode, defaultValue?: number }) {
    const form = useForm({
      defaultValues: { age: defaultValue },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render number input type', () => {
    const { container } = render(
      <TestWrapper>
        <InputNumber name="age" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should handle number values', () => {
    const { container } = render(
      <TestWrapper defaultValue={42}>
        <InputNumber name="age" />
      </TestWrapper>
    )
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('42')
  })
})
