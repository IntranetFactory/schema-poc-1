import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from '@tanstack/react-form'
import { InputEmail } from '../InputEmail'
import { FormProvider } from '../FormContext'
import type { FormContextValue } from '../FormContext'

describe('InputEmail', () => {
  function TestWrapper({ 
    children, 
    required = false,
    validatorFn = () => undefined
  }: { 
    children: React.ReactNode
    required?: boolean
    validatorFn?: (value: any) => string | undefined
  }) {
    const form = useForm({
      defaultValues: { email: '' },
      onSubmit: async () => {},
    })

    const mockContext: FormContextValue = {
      form,
      schema: { 
        type: 'object', 
        properties: {
          email: { type: 'string', format: 'email', required }
        },
        required: required ? ['email'] : []
      },
      validateField: validatorFn,
    }

    return <FormProvider value={mockContext}>{children}</FormProvider>
  }

  it('should render email input type', () => {
    const { container } = render(
      <TestWrapper>
        <InputEmail name="email" />
      </TestWrapper>
    )
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('should show required indicator when required', () => {
    render(
      <TestWrapper required>
        <InputEmail name="email" label="Email" required />
      </TestWrapper>
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should validate required field', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper 
        required
        validatorFn={(value) => !value ? 'must not be empty' : undefined}
      >
        <InputEmail 
          name="email" 
          label="Email" 
          required
          validators={{
            onBlur: ({ value }) => !value ? 'must not be empty' : undefined,
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/email/i)
    await user.click(input)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/must not be empty/i)).toBeInTheDocument()
    })
  })

  it('should detect invalid email format', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper
        validatorFn={(value) => {
          if (!value) return undefined
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return !emailRegex.test(value) ? 'must match format "email"' : undefined
        }}
      >
        <InputEmail 
          name="email" 
          label="Email"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return undefined
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return !emailRegex.test(value) ? 'must match format "email"' : undefined
            },
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/email/i)
    await user.type(input, 'invalid-email')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/must match format "email"/i)).toBeInTheDocument()
    })
  })

  it('should accept valid email', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper
        validatorFn={(value) => {
          if (!value) return undefined
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return !emailRegex.test(value) ? 'must match format "email"' : undefined
        }}
      >
        <InputEmail 
          name="email" 
          label="Email"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return undefined
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
              return !emailRegex.test(value) ? 'must match format "email"' : undefined
            },
          }}
        />
      </TestWrapper>
    )

    const input = screen.getByLabelText(/email/i) as HTMLInputElement
    await user.type(input, 'user@example.com')
    await user.tab()

    await waitFor(() => {
      expect(screen.queryByText(/must match format "email"/i)).not.toBeInTheDocument()
      expect(input.value).toBe('user@example.com')
    })
  })
})
