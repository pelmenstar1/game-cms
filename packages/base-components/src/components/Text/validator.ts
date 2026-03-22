import { TextOptions } from './types.js';

export function validator(text: unknown, options: TextOptions) {
  if (typeof text !== 'string') {
    return 'INVALID_TYPE';
  }

  const { minLength, maxLength } = options;

  if (minLength !== undefined && text.length < minLength) {
    return 'TEXT_TOO_SHORT';
  }

  if (maxLength !== undefined && text.length > maxLength) {
    return 'TEXT_TOO_LONG';
  }
}
