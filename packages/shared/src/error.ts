import { isNonNullObject } from './typecheck.js';

export function isErrorWithCode(value: unknown, code: string) {
  return isNonNullObject(value) && (value as { code?: string }).code === code;
}
