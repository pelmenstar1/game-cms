import type { RawConditionalNotation } from './types.js';

export function isValidConditionalNotation(
  value: string
): value is RawConditionalNotation {
  return true;
}
