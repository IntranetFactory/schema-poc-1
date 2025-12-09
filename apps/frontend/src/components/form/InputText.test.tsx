import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useForm } from '@tanstack/react-form'
import { InputText } from './InputText'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('InputText', () => {
  const mockContext: FormContextValue = {
    schema: { type: 'object', properties: {} },
    validateField: () => undefined,
  }

  function TestWrapper({ children }: { children: React.ReactNode }) {
    return (
      <FormProvider value={mockContext}>
        {children}
      </FormProvider>
    )
  }

  it('should render with label', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { testField: '' },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputText form={form} name="testField" label="Username" />
        </TestWrapper>
      )
    }

    render(<FormWithField />)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('should show required indicator', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { testField: '' },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputText form={form} name="testField" label="Username" required />
        </TestWrapper>
      )
    }

    render(<FormWithField />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should display description', () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { testField: '' },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputText form={form} name="testField" description="Enter your username" />
        </TestWrapper>
      )
    }

    render(<FormWithField />)
    expect(screen.getByText('Enter your username')).toBeInTheDocument()
  })

  it('should execute validator and show error', async () => {
    function FormWithField() {
      const form = useForm({
        defaultValues: { testField: '' },
        onSubmit: async () => {},
      })
      
      return (
        <TestWrapper>
          <InputText 
            form={form} 
            name="testField" 
            label="Username"
            validators={{
              onBlur: ({ value }) => value ? undefined : 'This field is required'
            }}
          />
        </TestWrapper>
      )
    }

    const { container } = render(<FormWithField />)
    const input = container.querySelector('input')
    
    // Trigger blur to run validation
    input?.focus()
    input?.blur()
    
    // Wait for validation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(screen.queryByText('This field is required')).toBeInTheDocument()
  })
})
