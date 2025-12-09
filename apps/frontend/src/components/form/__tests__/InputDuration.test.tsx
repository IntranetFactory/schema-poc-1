import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputDuration } from '../InputDuration'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputDuration', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { duration: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render duration input', () => {
    const { container } = render(
      <TestWrapper>
        <InputDuration name="duration" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
  })
})
