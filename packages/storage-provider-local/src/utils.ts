import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { PassThrough, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { FileSource } from '@game-cms/base-core';

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

    let size = 0;

    const meter = new PassThrough();

    meter.on('data', (chunk: { length: number }) => {
      size += chunk.length;
    });

    await pipeline(stream, meter, writeStream);

    return size;
  } else {
    await fsp.writeFile(filePath, stream, options);

    return stream.length;
  }
}
