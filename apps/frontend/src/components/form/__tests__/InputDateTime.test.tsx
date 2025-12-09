import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import { InputDateTime } from '../InputDateTime'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputDateTime', () => {
  function TestWrapper({ 
    children, 
    required = false 
  }: { 
    children: React.ReactNode
    required?: boolean
  }) {
    const form = useForm({
      defaultValues: { datetime: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { 
        type: 'object', 
        properties: {
          datetime: { type: 'string', format: 'date-time', required }
        },
        required: required ? ['datetime'] : []
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

  it('should render datetime-local input', () => {
    const { container } = render(
      <TestWrapper>
        <InputDateTime name="datetime" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'datetime-local')
  })

  it('should have proper styling with border', () => {
    const { container } = render(
      <TestWrapper>
        <InputDateTime name="datetime" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input?.className).toContain('border')
  })

  it('should show required indicator when field is required', () => {
    render(
      <TestWrapper required>
        <InputDateTime name="datetime" label="DateTime" required />
      </TestWrapper>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should support validation via validators prop', () => {
    render(
      <TestWrapper required>
        <InputDateTime 
          name="datetime" 
          label="DateTime" 
          required 
          validators={{
            onBlur: () => 'must not be empty',
            onSubmit: () => 'must not be empty'
          }}
        />
      </TestWrapper>
    )
    // Test that the component accepts validators prop without error
    expect(screen.getByLabelText(/datetime/i)).toBeInTheDocument()
  })

  it('should display label and description', () => {
    render(
      <TestWrapper>
        <InputDateTime 
          name="datetime" 
          label="Event Time" 
          description="Select the event date and time"
        />
      </TestWrapper>
    )
    expect(screen.getByText('Event Time')).toBeInTheDocument()
    expect(screen.getByText('Select the event date and time')).toBeInTheDocument()
  })
})
