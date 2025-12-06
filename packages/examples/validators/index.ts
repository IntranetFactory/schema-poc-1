import { validateData } from 'sem-schema';
import productSchema from '../schemas/product.schema.json';
import faqItemSchema from '../schemas/faqitem.schema.json';

/**
 * Validate product data against product schema
 */
export function validateProduct(data: any) {
  return validateData(data, productSchema as any);
}

/**
 * Validate FAQ item data against FAQ schema
 */
export function validateFaqItem(data: any) {
  return validateData(data, faqItemSchema as any);
}
