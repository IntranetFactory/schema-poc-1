const { validateData, validateSchema } = require('./packages/sem-schema/src/api');

const schema = {
  "$schema": "https://semantius.com/meta/sem-schema",
  "$vocabulary": {
    "https://json-schema.org/draft/2020-12/vocab/core": true,
    "https://json-schema.org/draft/2020-12/vocab/validation": true,
    "https://semantius.com/vocab/sem-schema/formats": true,
    "https://semantius.com/vocab/sem-schema/validation": true
  },
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name"
    },
    "email": {
      "type": "string",
      "title": "Email"
    }
  },
  "required": ["name"]
};

const data = {
  "email": ""
};

console.log('Testing schema validation...');
const schemaResult = validateSchema(schema);
console.log('Schema validation result:', JSON.stringify(schemaResult, null, 2));

console.log('\nTesting data validation...');
try {
  const dataResult = validateData(data, schema);
  console.log('Data validation result:', JSON.stringify(dataResult, null, 2));
} catch (error) {
  console.log('ERROR:', error.message);
}
