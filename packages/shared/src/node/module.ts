import { isNonNullObject } from '../typecheck.js';

export function isModuleNotFoundError(error: unknown): boolean {
  if (isNonNullObject(error)) {
    const { code } = error;

    return code === 'ERR_MODULE_NOT_FOUND' || code === 'MODULE_NOT_FOUND';
  }

  return false;
}
