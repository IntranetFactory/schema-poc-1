import { SchemaObject } from 'ajv';
import { createSemSchemaValidator, preprocessSchema } from 'sem-schema';
import productSchema from '../schemas/product.schema.json';
import faqItemSchema from '../schemas/faqitem.schema.json';

// Create AJV instance with SemSchema vocabulary
const ajv = createSemSchemaValidator();

// Preprocess and compile schemas
const processedProductSchema = preprocessSchema(productSchema as SchemaObject);
const processedFaqItemSchema = preprocessSchema(faqItemSchema as SchemaObject);

export const validateProduct = ajv.compile(processedProductSchema);
export const validateFaqItem = ajv.compile(processedFaqItemSchema);
