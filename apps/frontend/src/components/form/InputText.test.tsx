import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputText } from './InputText'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputText', () => {
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

  it('should throw error when used outside SchemaForm', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = () => {}

    expect(() => {
      render(<InputText {...mockProps} />)
    }).toThrow('useFormContext must be used within a SchemaForm component')

    console.error = originalError
  })

  it('should render with label', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} label="Username" />
      </FormProvider>
    )

    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should show required indicator', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} label="Username" required />
      </FormProvider>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should display error message', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} error="This field is required" />
      </FormProvider>
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should display description', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} description="Enter your username" />
      </FormProvider>
    )

    expect(screen.getByText('Enter your username')).toBeInTheDocument()
  })

  it('should disable input when disabled prop is true', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} disabled={true} />
      </FormProvider>
    )

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('should have proper aria-invalid when error exists', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} error="Invalid value" />
      </FormProvider>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('should link error message with aria-describedby', () => {
    render(
      <FormProvider value={mockContext}>
        <InputText {...mockProps} name="username" error="Invalid value" />
      </FormProvider>
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'username-error')
  })
})
