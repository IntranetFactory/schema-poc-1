import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputHtml } from '../InputHtml'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputHtml', () => {
  function TestWrapper({ children }: { children: React.ReactNode }) {
    const form = useForm({
      defaultValues: { html: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { type: 'object', properties: {} },
      validateField: () => undefined,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render html editor', () => {
    const { container } = render(
      <TestWrapper>
        <InputHtml name="html" />
      </TestWrapper>
    )
    const editor = container.querySelector('.cm-editor')
    expect(editor).toBeTruthy()
  })
})
