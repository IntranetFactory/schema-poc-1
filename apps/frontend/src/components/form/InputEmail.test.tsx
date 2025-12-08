import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputEmail } from './InputEmail'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputEmail', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  const mockProps = {
    name: 'testField',
    label: 'Test Field',
    value: '',
    onChange: () => {},
  }

  it('should work when used inside FormProvider', () => {
    expect(() => {
      render(
        <FormProvider value={mockContext}>
          <InputEmail {...mockProps} />
        </FormProvider>
      )
    }).not.toThrow()
  })

  it('should render email input type', () => {
    render(
      <FormProvider value={mockContext}>
        <InputEmail {...mockProps} />
      </FormProvider>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })
})
