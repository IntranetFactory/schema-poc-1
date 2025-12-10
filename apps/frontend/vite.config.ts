import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Schema validation and AJV
          if (id.includes('sem-schema') || id.includes('ajv')) {
            return 'schema-validation'
          }
          
          // CodeMirror - lazy loaded
          if (id.includes('@codemirror') || id.includes('@uiw/react-codemirror')) {
            return 'codemirror'
          }
          
          // Form core controls (common controls)
          if (id.includes('/form/InputText.tsx') ||
              id.includes('/form/InputNumber.tsx') ||
              id.includes('/form/InputBoolean.tsx') ||
              id.includes('/form/InputEnum.tsx') ||
              id.includes('/form/InputDate.tsx') ||
              id.includes('/form/InputTextarea.tsx')) {
            return 'form-core'
          }
          
          // Form extended controls (all other input controls)
          if (id.includes('/form/Input') && id.endsWith('.tsx')) {
            return 'form-ext'
          }
          
          // React vendor
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'vendor-react'
          }
          
          // UI components vendor
          if (id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/react-day-picker')) {
            return 'vendor-ui'
          }
          
          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-other'
          }
        }
      }
    }
  }
})
