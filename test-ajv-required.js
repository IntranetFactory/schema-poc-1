const Ajv = require('ajv');

const ajv = new Ajv();

const schema1 = { type: 'string', required: true };
console.log('Schema 1:', JSON.stringify(schema1));
try {
  ajv.compile(schema1);
  console.log('Result 1: VALID');
} catch (e) {
  console.log('Result 1 ERROR:', e.message);
}

const schema2 = {
  type: 'object',
  properties: {
    name: { type: 'string', required: true }
  }
};
console.log('\nSchema 2:', JSON.stringify(schema2, null, 2));
try {
  ajv.compile(schema2);
  console.log('Result 2: VALID');
} catch (e) {
  console.log('Result 2 ERROR:', e.message);
}
