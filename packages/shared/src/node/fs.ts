import type { WriteStream } from 'node:fs';
import fsp from 'node:fs/promises';

import type { AnyAsyncFunction } from '../typeutil.js';
import { isFileNotFoundError } from './error.js';

function ifExistsFn<F extends AnyAsyncFunction<void>>(fn: F): F;

function ifExistsFn<F extends AnyAsyncFunction>(
  fn: F,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  fallback: Awaited<ReturnType<F>>
): F;

function ifExistsFn<F extends AnyAsyncFunction>(
  fn: F,
  fallback?: Awaited<ReturnType<F>>
) {
  const result = async (...args: Parameters<F>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (!isFileNotFoundError(error)) {
        throw error;
      }

      return fallback;
    }
  };

  return result as F;
}

export const deleteFileIfExists = ifExistsFn(fsp.rm);
export const readDirectoryIfExists = ifExistsFn(fsp.readdir, []);

export function waitUntilWriteStreamOpens(stream: WriteStream) {
  return new Promise<number>((resolve, reject) => {
    stream.on('open', resolve);
    stream.on('error', reject);
  });
}
