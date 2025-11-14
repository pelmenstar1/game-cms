import { isNonNullObject } from '../typecheck.js';

export function isErrorWithCode(value: unknown, code: string) {
  return isNonNullObject(value) && (value as { code?: string }).code === code;
}

export function isFileNotFoundError(value: unknown) {
  return isErrorWithCode(value, 'ENOENT');
}

export function isEntityExistsError(value: unknown) {
  return isErrorWithCode(value, 'EEXIST');
}
