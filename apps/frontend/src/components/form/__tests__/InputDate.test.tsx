import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import { InputDate } from '../InputDate'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputDate', () => {
  function TestWrapper({ 
    children, 
    defaultValue,
    required = false,
    validators = {}
  }: { 
    children: React.ReactNode
    defaultValue?: string
    required?: boolean
    validators?: any
  }) {
    const form = useForm({
      defaultValues: { date: defaultValue || '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { 
        type: 'object', 
        properties: {
          date: { type: 'string', format: 'date', required }
        },
        required: required ? ['date'] : []
      },
      validateField: (value: any, fieldName: string) => {
        if (required && !value) {
          return 'must not be empty'
        }
        return undefined
      },
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render date picker button', () => {
    const { container } = render(
      <TestWrapper>
        <InputDate name="date" />
      </TestWrapper>
    )
    const button = container.querySelector('button')
    expect(button).toBeTruthy()
    expect(button?.textContent).toContain('Pick a date')
  })

  it('should show required indicator when field is required', () => {
    render(
      <TestWrapper required>
        <InputDate name="date" label="Date" required />
      </TestWrapper>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should support validation via validators prop', () => {
    render(
      <TestWrapper required>
        <InputDate 
          name="date" 
          label="Date" 
          required 
          validators={{
            onBlur: () => 'must not be empty'
          }}
        />
      </TestWrapper>
    )
    // Test that the component accepts validators prop without error
    expect(screen.getByRole('button', { name: /pick a date/i })).toBeInTheDocument()
  })

  it('should display label and description', () => {
    render(
      <TestWrapper>
        <InputDate 
          name="date" 
          label="Birth Date" 
          description="Select your birth date"
        />
      </TestWrapper>
    )
    expect(screen.getByText('Birth Date')).toBeInTheDocument()
    expect(screen.getByText('Select your birth date')).toBeInTheDocument()
  })

  it('should handle default value', () => {
    const { container } = render(
      <TestWrapper defaultValue="2024-01-15">
        <InputDate name="date" />
      </TestWrapper>
    )
    const button = container.querySelector('button')
    // Date should be formatted and displayed
    expect(button).toBeTruthy()
    expect(button?.textContent).toContain('Jan')
  })
})
