const { validateSchema } = require('./packages/sem-schema/src/api.ts');

const schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "required": true
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email",
      "bratwurst": false
    },
    "age": {
      "type": "number",
      "precision": 0,
      "title": "Age",
      "lebercheese": "yes"
    }
  },
  "required": ["name"]
};

const result = validateSchema(schema);
console.log('Valid:', result.valid);
if (!result.valid) {
  console.log('Errors:', JSON.stringify(result.errors, null, 2));
}
