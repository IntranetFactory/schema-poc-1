import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InputText } from './InputText'
import { InputEmail } from './InputEmail'
import { InputNumber } from './InputNumber'
import { InputBoolean } from './InputBoolean'
import { FormProvider } from './FormContext'
import type { FormContextValue } from './FormContext'

describe('Form Controls', () => {
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

  describe('Context Requirement', () => {
    it('InputText should throw error when used outside SchemaForm', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = () => {}

      expect(() => {
        render(<InputText {...mockProps} />)
      }).toThrow('useFormContext must be used within a SchemaForm component')

      console.error = originalError
    })

    it('InputEmail should work when used inside FormProvider', () => {
      expect(() => {
        render(
          <FormProvider value={mockContext}>
            <InputEmail {...mockProps} />
          </FormProvider>
        )
      }).not.toThrow()
    })
  })

  describe('InputText', () => {
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
  })

  describe('InputEmail', () => {
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

  describe('InputNumber', () => {
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

  describe('InputBoolean', () => {
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

  describe('Disabled State', () => {
    it('should disable input when disabled prop is true', () => {
      render(
        <FormProvider value={mockContext}>
          <InputText {...mockProps} disabled={true} />
        </FormProvider>
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })
  })

  describe('Accessibility', () => {
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
})
