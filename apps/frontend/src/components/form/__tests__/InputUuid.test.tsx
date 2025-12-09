import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputUuid } from '../InputUuid'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputUuid', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { uuid: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render uuid input', () => {
    const { container } = render(
      <TestWrapper>
        <InputUuid name="uuid" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
  })
})
