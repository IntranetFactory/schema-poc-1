import { SchemaObject } from 'ajv';
import { createCustomSchemaValidator, preprocessSchema } from 'sem-schema';
import productSchema from '../schemas/product.schema.json';
import faqItemSchema from '../schemas/faqitem.schema.json';

// Create AJV instance with custom schema vocabulary
const ajv = createCustomSchemaValidator();

// Preprocess and compile schemas
const processedProductSchema = preprocessSchema(productSchema as SchemaObject);
const processedFaqItemSchema = preprocessSchema(faqItemSchema as SchemaObject);

export const validateProduct = ajv.compile(processedProductSchema);
export const validateFaqItem = ajv.compile(processedFaqItemSchema);
