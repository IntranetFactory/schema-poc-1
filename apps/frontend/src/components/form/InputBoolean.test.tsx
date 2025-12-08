import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputBoolean } from './InputBoolean'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputBoolean', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  const mockProps = {
    name: 'testField',
    label: 'Test Field',
    value: false,
    onChange: () => {},
  }

  it('should render checkbox', () => {
    render(
      <FormProvider value={mockContext}>
        <InputBoolean {...mockProps} />
      </FormProvider>
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('should be checked when value is true', () => {
    render(
      <FormProvider value={mockContext}>
        <InputBoolean {...mockProps} value={true} />
      </FormProvider>
    )

    const checkbox = screen.getByRole('checkbox')
    // Radix UI Checkbox uses data-state attribute
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })
})
