import fsp from 'node:fs/promises';
import path from 'node:path';

import { type MaybePromise } from '@game-cms/shared';
import { isFileNotFoundError } from '@game-cms/shared/node';

export async function scanDirectory<T>(
  directoryPath: string,
  handler: (filePath: string) => MaybePromise<T | undefined>
): Promise<T[]> {
  try {
    const entries = await fsp.readdir(directoryPath, { withFileTypes: true });

    const result = (await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
          return scanDirectory(entryPath, handler);
        } else if (entry.isFile()) {
          return handler(entryPath);
        }
      })
    )) as (T | undefined)[][];

    return result.flat().filter((value) => value !== undefined);
  } catch (error: unknown) {
    if (isFileNotFoundError(error)) {
      return [];
    }

    throw error;
  }
}
