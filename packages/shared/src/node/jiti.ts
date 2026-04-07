import type { Jiti, JitiResolveOptions } from 'jiti';

import { MODULE_NOT_FOUND_MARK } from './module.js';

export async function maybeJitiImport<T>(
  jiti: Jiti,
  id: string,
  opts?: JitiResolveOptions
) {
  const result = await jiti.import<T | undefined>(id, { ...opts, try: true });
  if (result === undefined) {
    return MODULE_NOT_FOUND_MARK;
  }

  return result;
}
