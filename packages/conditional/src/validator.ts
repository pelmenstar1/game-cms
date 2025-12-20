import { parseConditionalNotation } from './parser.js';
import type { RawConditionalNotation } from './types.js';

export function isValidConditionalNotation(
  value: string
): value is RawConditionalNotation {
  try {
    parseConditionalNotation(value);

    return true;
  } catch {
    return false;
  }
}
