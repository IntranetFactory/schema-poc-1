import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputEmail } from './InputEmail'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputEmail', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  function TestWrapper({ children }: { children: React.ReactNode }) {
    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render email input type', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { email: '' },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputEmail form={form} name="email" />
        </TestWrapper>
      )
    }

    const { container } = render(<FormWithField />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')
  })
})
