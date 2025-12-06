/**
 * Custom string formats for sem-schema vocabulary
 */
import Ajv from 'ajv';
import { addJsonFormat } from './json';
import { addHtmlFormat } from './html';
import { addTextFormat } from './text';

export { validateJsonFormat, addJsonFormat } from './json';
export { validateHtmlFormat, addHtmlFormat } from './html';
export { validateTextFormat, addTextFormat } from './text';

/**
 * Add all custom formats to AJV instance
 */
export function addAllFormats(ajv: Ajv): void {
  addJsonFormat(ajv);
  addHtmlFormat(ajv);
  addTextFormat(ajv);
}
