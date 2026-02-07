import { isFloatString } from './isFloat.js';

export function safeParseFloat(text: string) {
  if (isFloatString(text)) {
    const result = Number.parseFloat(text);

    if (!Number.isNaN(result)) {
      return result;
    }
  }

  return null;
}
