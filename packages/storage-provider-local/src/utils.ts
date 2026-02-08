import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { PassThrough, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import { FileSource } from '@game-cms/base-core';

export async function writeFileSourceToFile(
  stream: FileSource,
  filePath: string,
  flag?: string
) {
  if (stream instanceof Readable) {
    const writeStream = fs.createWriteStream(filePath, { flags: flag });

    let size = 0;

    const meter = new PassThrough();

    meter.on('data', (chunk: { length: number }) => {
      size += chunk.length;
    });

    await pipeline(stream, meter, writeStream);

    return size;
  } else {
    await fsp.writeFile(filePath, stream, { flag });

    return stream.length;
  }
}
