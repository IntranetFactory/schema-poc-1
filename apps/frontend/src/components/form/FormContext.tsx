import { createContext, useContext } from 'react'
import type { SchemaObject } from 'ajv'

/**
 * Form Context
 * 
 * Provides access to the form schema and validation state for all form controls.
 * Form controls use this context to access schema information and perform validation.
 */
export interface FormContextValue {
  schema: SchemaObject
  /** Validate a single field value against its schema */
  validateField: (value: any, fieldName: string) => string | undefined
}

const FormContext = createContext<FormContextValue | null>(null)

export const FormProvider = FormContext.Provider

/**
 * Hook to access form context from within form control components
 * 
 * @throws Error if used outside of SchemaForm
 */
export function useFormContext(): FormContextValue {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within a SchemaForm component')
  }
  return context
}
