import { isErrorWithCode } from '../error.js';

export function isFileNotFoundError(value: unknown) {
  return isErrorWithCode(value, 'ENOENT');
}

export function isEntityExistsError(value: unknown) {
  return isErrorWithCode(value, 'EEXIST');
}
