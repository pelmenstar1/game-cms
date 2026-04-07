import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

import { isModuleNotFoundError, MODULE_NOT_FOUND_MARK } from './module.js';

export function importFile<T = unknown>(filePath: string): Promise<T> {
  return import(
    /* @vite-ignore */
    pathToFileURL(filePath).href
  );
}

export async function maybeImportFile<T = unknown>(filePath: string) {
  try {
    return await importFile<T>(filePath);
  } catch (error) {
    if (isModuleNotFoundError(error) && !fs.existsSync(filePath)) {
      return MODULE_NOT_FOUND_MARK;
    }

    throw error;
  }
}
