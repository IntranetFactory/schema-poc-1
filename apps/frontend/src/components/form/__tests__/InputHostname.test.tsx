import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputHostname } from '../InputHostname'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputHostname', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { hostname: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render hostname input', () => {
    const { container } = render(
      <TestWrapper>
        <InputHostname name="hostname" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
  })
})
