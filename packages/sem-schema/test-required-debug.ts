import { validateSchema } from './src/api';

const schema1 = { type: 'string', required: true };
console.log('Schema 1:', JSON.stringify(schema1));
const result1 = validateSchema(schema1);
console.log('Result 1:', JSON.stringify(result1, null, 2));

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
console.log('\nSchema 2:', JSON.stringify(schema2, null, 2));
const result2 = validateSchema(schema2);
console.log('Result 2:', JSON.stringify(result2, null, 2));
