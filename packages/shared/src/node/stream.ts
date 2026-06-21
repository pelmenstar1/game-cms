import { PassThrough, Readable } from 'node:stream';

import type { FileSource } from './fileSource.js';

export type MeteredStream = ReturnType<typeof meteredStream>;

export function meteredStream(source: FileSource) {
  if (source instanceof Readable) {
    let size = 0;
    const pass = new PassThrough();

    pass.on('data', (chunk: { length: number }) => {
      size += chunk.length;
    });

    source.pipe(pass);

    return {
      body: pass,
      get size() {
        return size;
      },
    };
  }

  return { body: source, size: source.length };
}
