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
        inputMode: 'required',
        description: 'Your full name',
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'Email',
        inputMode: 'required',
      },
      age: {
        type: 'integer',
        title: 'Age',
      },
    },
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

  describe('Readonly Functionality', () => {
    it('should make all fields readonly when readonly prop is true', () => {
      render(<SchemaForm schema={basicSchema} readonly={true} />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const ageInput = screen.getByLabelText(/age/i)

      // Check that all inputs have readonly attribute
      expect(nameInput).toHaveAttribute('readonly')
      expect(emailInput).toHaveAttribute('readonly')
      expect(ageInput).toHaveAttribute('readonly')
    })

    it('should allow editing when readonly prop is false', () => {
      render(<SchemaForm schema={basicSchema} readonly={false} />)

      const nameInput = screen.getByLabelText(/name/i)
      
      // Should not have readonly attribute
      expect(nameInput).not.toHaveAttribute('readonly')
    })

    it('should respect field-level readonly even when form readonly is false', () => {
      const schemaWithReadonly: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', inputMode: 'readonly' },
          email: { type: 'string', format: 'email', title: 'Email' },
        },
      }

      render(<SchemaForm schema={schemaWithReadonly} readonly={false} />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      // Name should be readonly due to field-level setting
      expect(nameInput).toHaveAttribute('readonly')
      // Email should not be readonly
      expect(emailInput).not.toHaveAttribute('readonly')
    })

    it('should make field readonly when either form or field readonly is true', () => {
      const schemaWithReadonly: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', inputMode: 'readonly' },
          email: { type: 'string', format: 'email', title: 'Email' },
        },
      }

      render(<SchemaForm schema={schemaWithReadonly} readonly={true} />)

      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)

      // Both should be readonly
      expect(nameInput).toHaveAttribute('readonly')
      expect(emailInput).toHaveAttribute('readonly')
    })
  })

  describe('Schema-level Required Array', () => {
    it('should include fields from schema.required array even with empty values', async () => {
      const schemaWithRequired: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          email: { type: 'string', format: 'email', title: 'Email' },
        },
        required: ['name'], // Object-level required (no inputMode on property)
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={schemaWithRequired} onSubmit={onSubmit} />)

      // Leave name empty but enter email
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should call onSubmit with empty name (because it's in required array)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: '',
            email: 'test@example.com',
          })
        )
      })
    })

    it('should validate object-level required fields exist even if empty', async () => {
      const schemaWithRequired: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          email: { type: 'string', format: 'email', title: 'Email' },
        },
        required: ['name'], // name must exist in data
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      
      // Initialize with data that has name (empty string is valid)
      render(
        <SchemaForm 
          schema={schemaWithRequired} 
          initialValue={{ name: '', email: '' }}
          onSubmit={onSubmit} 
        />
      )

      // Enter only email
      await user.clear(screen.getByLabelText(/email/i))
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Form should submit successfully because name exists (even though empty)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled()
      })
    })

    it('should differentiate between inputMode required and schema required', async () => {
      const schema: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', inputMode: 'required' }, // UI required (non-empty)
          email: { type: 'string', format: 'email', title: 'Email' }, // No UI marker
        },
        required: ['email'], // email must exist in data (but can be empty)
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={schema} onSubmit={onSubmit} />)

      // Enter name but leave email empty
      await user.type(screen.getByLabelText(/name/i), 'John Doe')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should include empty email (schema required) but not fail on it being empty
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: '',
          })
        )
      })
    })

    it('should include optional fields with empty values in submission', async () => {
      // Optional fields (not in required array, no inputMode required) should still be included
      const schema: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', inputMode: 'required' },
          email: { type: 'string', format: 'email', title: 'Email' }, // Optional
          age: { type: 'integer', title: 'Age' }, // Optional
        },
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={schema} onSubmit={onSubmit} />)

      // Fill only required field, leave optional fields empty
      await user.type(screen.getByLabelText(/name/i), 'John Doe')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should include ALL schema properties, even empty optional ones
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Doe',
            email: '',
            age: undefined, // or '' depending on field type
          })
        )
      })
    })

    it('should display schema validation errors in UI', async () => {
      // Create an invalid schema that will fail schema validation
      const invalidSchema: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
        },
        required: 'invalid_format' as any, // Should be array, not string
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={invalidSchema} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/name/i), 'John Doe')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should display schema validation error in UI
      await waitFor(() => {
        expect(screen.getByText(/invalid schema/i)).toBeInTheDocument()
      })

      // Should not call onSubmit
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('should display validation errors for non-existent required fields in UI', async () => {
      // Schema with required field that doesn't exist in properties
      const schema: SchemaObject = {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name', inputMode: 'required' },
        },
        required: ['name', 'nonExistent'], // 'nonExistent' is not in properties
      }

      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<SchemaForm schema={schema} onSubmit={onSubmit} />)

      // Fill in name
      await user.type(screen.getByLabelText(/name/i), 'John Doe')

      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Should display validation error for the missing required field
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
        expect(screen.getByText(/nonExistent/i)).toBeInTheDocument()
        expect(screen.getByText(/must have required property/i)).toBeInTheDocument()
      })

      // Should not call onSubmit
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})

