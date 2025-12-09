import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputEmail } from '../InputEmail'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputEmail', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { email: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render email input type', () => {
    const { container } = render(
      <TestWrapper>
        <InputEmail name="email" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')
  })
})
