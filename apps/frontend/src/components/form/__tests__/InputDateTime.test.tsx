import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputDateTime } from '../InputDateTime'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputDateTime', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { datetime: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render datetime input', () => {
    const { container } = render(
      <TestWrapper>
        <InputDateTime name="datetime" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'datetime-local')
  })
})
