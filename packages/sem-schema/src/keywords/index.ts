/**
 * Custom keywords for sem-schema vocabulary
 */
import Ajv from 'ajv';
import { addRequiredKeyword } from './required';
import { addPrecisionKeyword } from './precision';

export { addRequiredKeyword } from './required';
export { addPrecisionKeyword } from './precision';

/**
 * Add all custom keywords to AJV instance
 */
export function addAllKeywords(ajv: Ajv): void {
  addRequiredKeyword(ajv);
  addPrecisionKeyword(ajv);
}
