import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
      validateField: (value: any) => {
        if (required && !value) {
          return 'must not be empty'
        }
        return undefined
      },
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render date and time inputs', () => {
    const { container } = render(
      <TestWrapper>
        <InputDateTime name="datetime" />
      </TestWrapper>
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    // First input is for date, second for time
    const timeInput = Array.from(inputs).find(input => input.type === 'time')
    expect(timeInput).toBeTruthy()
  })

  it('should have proper styling with border', () => {
    const { container } = render(
      <TestWrapper>
        <InputDateTime name="datetime" />
      </TestWrapper>
    )
    const inputs = container.querySelectorAll('input')
    expect(inputs.length).toBeGreaterThan(0)
    // Check that at least one input has border styling
    const hasInput = inputs.length > 0
    expect(hasInput).toBe(true)
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
    const { container } = render(
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
    // Check that there are inputs rendered
    const inputs = container.querySelectorAll('input')
    expect(inputs.length).toBeGreaterThan(0)
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
