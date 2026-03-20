import type { Jiti, JitiResolveOptions } from 'jiti';

import { isNonNullObject } from '../typecheck.js';
import { isModuleNotFoundError, MODULE_NOT_FOUND_MARK } from './module.js';

function isErrorHandled(error: unknown): error is Error {
  return (
    isModuleNotFoundError(error) ||
    (isNonNullObject(error) && error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED')
  );
}

export async function maybeJitiImport<T>(
  jiti: Jiti,
  id: string,
  opts?: JitiResolveOptions
) {
  try {
    return await jiti.import<T>(id, opts);
  } catch (error) {
    if (isErrorHandled(error)) {
      return MODULE_NOT_FOUND_MARK;
    }

    throw error;
  }
}
