import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputIpv4 } from '../InputIpv4'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputIpv4', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { ipv4: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render ipv4 input', () => {
    const { container } = render(
      <TestWrapper>
        <InputIpv4 name="ipv4" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'text')
  })
})
