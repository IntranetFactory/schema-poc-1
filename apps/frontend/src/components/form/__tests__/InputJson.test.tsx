import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputJson } from '../InputJson'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputJson', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { json: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render json editor', () => {
    const { container } = render(
      <TestWrapper>
        <InputJson name="json" />
      </TestWrapper>
    )
    const editor = container.querySelector('.cm-editor')
    expect(editor).toBeTruthy()
  })
})
