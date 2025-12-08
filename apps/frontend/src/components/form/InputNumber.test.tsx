import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputNumber } from './InputNumber'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputNumber', () => {
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

  it('should render number input type', () => {
    render(
      <FormProvider value={mockContext}>
        <InputNumber {...mockProps} />
      </FormProvider>
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('should handle number values', () => {
    render(
      <FormProvider value={mockContext}>
        <InputNumber {...mockProps} value={42} />
      </FormProvider>
    )

    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('42')
  })
})
