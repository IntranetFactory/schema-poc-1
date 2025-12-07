import { Link } from '@tanstack/react-router'

const schemaFiles = [
  { name: 'Product Schema', path: '/schemas/product.schema.json' },
  { name: 'FAQ Item Schema', path: '/schemas/faqitem.schema.json' },
  { name: 'Person Schema', path: '/schemas/person.schema.json' },
  { name: 'Blog Post Schema', path: '/schemas/blogpost.schema.json' },
]

export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            SemSchema Validator
          </h1>
          
          <div className="mb-8">
            <p className="text-gray-700 mb-4">
              Welcome to the SemSchema Validator. This tool allows you to validate JSON Schemas
              with custom vocabulary extensions including custom formats (json, html, text),
              property-level required validation, and number precision control.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interactive Playground
            </h2>
            <Link
              to="/playground"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Open Playground →
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sample Schemas
            </h2>
            <p className="text-gray-600 mb-4">
              Explore our sample schemas to understand the custom vocabulary features:
            </p>
            <ul className="space-y-2">
              {schemaFiles.map((schema) => (
                <li key={schema.path}>
                  <a
                    href={schema.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {schema.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Custom Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li><strong>Custom Formats:</strong> json, html, text</li>
              <li><strong>Property-level Required:</strong> Validate non-empty strings at property level</li>
              <li><strong>Number Precision:</strong> Control decimal places (0-4)</li>
              <li><strong>Type Inference:</strong> Automatic type detection for formats</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
