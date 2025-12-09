import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputBoolean } from './InputBoolean'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputBoolean', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render checkbox', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { agree: false },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputBoolean form={form} name="agree" />
        </TestWrapper>
      )
    }

    render(<FormWithField />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('should be checked when value is true', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { agree: true },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputBoolean form={form} name="agree" />
        </TestWrapper>
      )
    }

    render(<FormWithField />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })
})
