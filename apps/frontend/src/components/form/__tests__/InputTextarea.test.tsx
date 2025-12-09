import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputTextarea } from '../InputTextarea'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputTextarea', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { text: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render textarea', () => {
    const { container } = render(
      <TestWrapper>
        <InputTextarea name="text" />
      </TestWrapper>
    )
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeTruthy()
  })
})
