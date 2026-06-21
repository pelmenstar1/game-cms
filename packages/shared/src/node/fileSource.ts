import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { PassThrough, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { isEntityExistsError } from './error.js';
import { waitUntilWriteStreamOpens } from './fs.js';

export type StaticFileSource = Uint8Array;
export type FileSource = StaticFileSource | Readable;

type WriteOptions = {
  flag?: string;
  signal?: AbortSignal;
};

export async function writeFileSourceToFile(
  stream: FileSource,
  filePath: string,
  options?: WriteOptions
) {
  if (stream instanceof Readable) {
    const writeStream = fs.createWriteStream(filePath, {
      flags: options?.flag,
      signal: options?.signal,
    });

    // It's important to wait for the stream to open before starting to pipe,
    // otherwise we might start consuming the stream.
    // It's not a correct behavior for writeFileSourceToNewFile,
    // because it retries to write the file source again,
    // and it won't work if the stream is already began to be consumed.
    await waitUntilWriteStreamOpens(writeStream);

    let size = 0;

    const meter = new PassThrough();

    meter.on('data', (chunk: { length: number }) => {
      size += chunk.length;
    });

    await pipeline(stream, meter, writeStream);

    return size;
  }

  await fsp.writeFile(filePath, stream, options);

  return stream.length;
}

export async function writeFileSourceToNewFile(
  source: FileSource,
  createFilePath: () => string,
  options?: Omit<WriteOptions, 'flag'>
) {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const filePath = createFilePath();

    try {
      const size = await writeFileSourceToFile(source, filePath, {
        ...options,
        flag: 'wx',
      });

      return { filePath, size };
    } catch (error: unknown) {
      if (!isEntityExistsError(error)) {
        throw error;
      }
    }
  }
}
