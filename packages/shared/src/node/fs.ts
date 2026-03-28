import type { RmOptions } from 'node:fs';
import fsp from 'node:fs/promises';

import { isFileNotFoundError } from './error.js';

export async function deleteFileIfExists(
  filePath: string,
  options?: RmOptions
) {
  try {
    await fsp.rm(filePath, options);
  } catch (error) {
    if (!isFileNotFoundError(error)) {
      throw error;
    }
  }
}
