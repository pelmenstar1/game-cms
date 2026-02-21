import { PassThrough, Readable } from 'node:stream';

type ReadableSource = Uint8Array | Readable;

export type MeteredStream = ReturnType<typeof meteredStream>;

export function meteredStream(source: ReadableSource) {
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
  } else {
    return { body: source, size: source.length };
  }
}
