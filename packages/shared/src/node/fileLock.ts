import fs from 'node:fs';
import fsp from 'node:fs/promises';

import { isEntityExistsError } from './error.js';

export async function createFileLock(filePath: string) {
  try {
    await fsp.writeFile(filePath, Buffer.alloc(0), { flag: 'wx' });
  } catch (error: unknown) {
    if (isEntityExistsError(error)) {
      throw new Error(`Lock file already exists at path: ${filePath}`);
    }

    throw error;
  }

  const cleanup = () => {
    fs.rmSync(filePath, { force: true });
  };

  process.on('exit', cleanup);

  return {
    [Symbol.asyncDispose]() {
      process.off('exit', cleanup);

      return fsp.rm(filePath, { force: true });
    },
  };
}
