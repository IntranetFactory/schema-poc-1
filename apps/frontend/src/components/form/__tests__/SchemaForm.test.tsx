import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SchemaForm } from '../SchemaForm'
import type { SchemaObject } from 'ajv'

describe('SchemaForm', () => {
  const basicSchema: SchemaObject = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        required: true,
        description: 'Your full name',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'Email',
        required: true,
      },
      age: {
        type: 'integer',
        title: 'Age',
      },
    },
    required: ['name', 'email'],
  }

  describe('Rendering', () => {
    it('should render all form fields from schema', () => {
      render(<SchemaForm schema={basicSchema} />)

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    })

    it('should mark required fields with asterisk', () => {
      render(<SchemaForm schema={basicSchema} />)

      // Check that asterisks are present for required fields
      const asterisks = screen.getAllByText('*')
      expect(asterisks.length).toBeGreaterThanOrEqual(2) // At least 2 required fields
    })

    it('should display field descriptions', () => {
      render(<SchemaForm schema={basicSchema} />)

      expect(screen.getByText('Your full name')).toBeInTheDocument()
    })

    it('should render submit and reset buttons', () => {
      render(<SchemaForm schema={basicSchema} />)

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })
  })

  describe('Field-Level Validation (onBlur)', () => {
    it('should validate required field on blur', async () => {
      const user = userEvent.setup()
      render(<SchemaForm schema={basicSchema} />)

      const nameInput = screen.getByLabelText(/name/i)
      
      // Focus then blur without entering value
      await user.click(nameInput)
      await user.tab() // Move focus away (blur)

      await waitFor(() => {
        expect(screen.getByText(/must not be empty/i)).toBeInTheDocument()
      })
    })

    it('should validate email format on blur', async () => {
      const user = userEvent.setup()
      render(<SchemaForm schema={basicSchema} />)

      const emailInput = screen.getByLabelText(/email/i)
      
      // Enter invalid email
      await user.type(emailInput, 'invalid-email')
      await user.tab() // Blur

      await waitFor(() => {
        expect(screen.getByText(/must match format "email"/i)).toBeInTheDocument()
      })
    })

    it('should clear error when valid value is entered', async () => {
      const user = userEvent.setup()
      render(<SchemaForm schema={basicSchema} />)

      const nameInput = screen.getByLabelText(/name/i)
      
      // Trigger error on name field
      await user.click(nameInput)
      await user.tab()
      await waitFor(() => {
        // Check specifically for name field error using aria-describedby
        expect(nameInput).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByText(/must not be empty/i)).toBeInTheDocument()
      })

      // Fix error by typing valid value
      await user.clear(nameInput)
      await user.type(nameInput, 'John Doe')
      
      // Manually trigger blur to validate
      nameInput.blur()

      await waitFor(() => {
        // Name field should no longer have error
        expect(nameInput).toHaveAttribute('aria-invalid', 'false')
        expect(nameInput).toHaveValue('John Doe')
      })
    })
  })

  describe('Form-Level Validation (onSubmit)', () => {
    it('should show all validation errors on submit', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={basicSchema} onSubmit={onSubmit} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Should show errors for required fields
        expect(screen.getAllByText(/must not be empty/i).length).toBeGreaterThan(0)
      })

      // Should not call onSubmit with invalid data
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should call onSubmit with valid data', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={basicSchema} onSubmit={onSubmit} />)

      // Fill in required fields
      await user.type(screen.getByLabelText(/name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email/i), 'john@example.com')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
          })
        )
      })
    })
  })

  describe('Default Values', () => {
    it('should generate default values from schema', () => {
      const schemaWithDefaults: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'Default Name' },
        },
      }

      render(<SchemaForm schema={schemaWithDefaults} />)

      expect(screen.getByDisplayValue('Default Name')).toBeInTheDocument()
    })

    it('should use provided initialValue over schema defaults', () => {
      const schemaWithDefaults: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', default: 'Default Name' },
        },
      }

      render(
        <SchemaForm
          schema={schemaWithDefaults}
          initialValue={{ name: 'Provided Name' }}
        />
      )

      expect(screen.getByDisplayValue('Provided Name')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Default Name')).not.toBeInTheDocument()
    })
  })

  describe('Control Mapping', () => {
    it('should use EmailInput for email format', () => {
      render(<SchemaForm schema={basicSchema} />)

      const emailInput = screen.getByLabelText(/email/i)
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('should use NumberInput for integer type', () => {
      render(<SchemaForm schema={basicSchema} />)

      const ageInput = screen.getByLabelText(/age/i)
      expect(ageInput).toHaveAttribute('type', 'number')
    })

    it('should use TextareaInput for text format', () => {
      const schemaWithText: SchemaObject = {
        type: 'object',
        properties: {
          bio: { format: 'text', title: 'Bio' },
        },
      }

      render(<SchemaForm schema={schemaWithText} />)

      const textarea = screen.getByLabelText(/bio/i)
      expect(textarea.tagName).toBe('TEXTAREA')
    })
  })

  describe('Reset Functionality', () => {
    it('should reset form to initial values', async () => {
      const user = userEvent.setup()
      render(<SchemaForm schema={basicSchema} />)

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement
      
      // Enter value
      await user.type(nameInput, 'John Doe')
      expect(nameInput.value).toBe('John Doe')

      // Reset
      const resetButton = screen.getByRole('button', { name: /reset/i })
      await user.click(resetButton)

      await waitFor(() => {
        expect(nameInput.value).toBe('')
      })
    })
  })
})
