# Frontend - Schema Validation Playground

A React + TypeScript + Vite application for testing JSON schemas and data validation using sem-schema.

## Features

- **Vite + React + TypeScript**: Fast development with hot module replacement
- **shadcn/ui v4**: Modern UI components with Tailwind CSS v4
- **TanStack Router**: Type-safe file-based routing
- **CodeMirror**: JSON editor with syntax highlighting
- **sem-schema Integration**: Real-time schema and data validation

## Getting Started

### Installation

From the root of the monorepo:

```bash
pnpm install
```

### Development

Start the development server:

```bash
cd apps/frontend
pnpm dev
```

The app will be available at `http://localhost:5173/`

### Building

Build for production:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## Usage

The playground provides four editors in a 2x2 grid:

1. **Schema Editor (Top-Left)**: Define your JSON schema with sem-schema custom keywords
2. **Data Editor (Top-Right)**: Enter JSON data to validate against the schema
3. **Schema Validation Result (Bottom-Left)**: See if your schema is valid
4. **Data Validation Result (Bottom-Right)**: See validation results and error messages

Changes in the editors trigger automatic validation in real-time.

## Key Dependencies

- **react**: UI framework
- **@tanstack/react-router**: File-based routing
- **@tanstack/react-form**: Form state management
- **@uiw/react-codemirror**: Code editor component
- **sem-schema**: Custom JSON Schema vocabulary (workspace dependency)
- **tailwindcss**: Utility-first CSS framework
- **shadcn/ui**: Component library

## Development Notes

- The app uses sem-schema directly from source via `workspace:*` dependency
- No build step is required for sem-schema during development
- TanStack Router automatically generates route types from the `src/routes/` directory

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
