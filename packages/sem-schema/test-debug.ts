import { validateSchema } from './src/api';

const schema1 = { type: 'string', required: true };
const result1 = validateSchema(schema1);
console.log('Test 1 - { type: "string", required: true }');
console.log('Valid:', result1.valid);
if (!result1.valid) {
  console.log('Errors:', JSON.stringify(result1.errors, null, 2));
}
console.log('');

const schema2 = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      required: true
    }
  },
  required: ['name']
};
const result2 = validateSchema(schema2);
console.log('Test 2 - Full schema with required: true in property');
console.log('Valid:', result2.valid);
if (!result2.valid) {
  console.log('Errors:', JSON.stringify(result2.errors, null, 2));
}
