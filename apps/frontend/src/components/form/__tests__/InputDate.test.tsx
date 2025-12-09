import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputDate } from '../InputDate'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputDate', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { date: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render date input', () => {
    const { container } = render(
      <TestWrapper>
        <InputDate name="date" />
      </TestWrapper>
    )
    const button = container.querySelector('button')
    expect(button).toBeTruthy()
  })
})
