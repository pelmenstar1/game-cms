import fsp from 'node:fs/promises';

import { xxh3 } from '@node-rs/xxhash';

export async function xxHashFile(filePath: string) {
  const buffer = await fsp.readFile(filePath);

  return xxh3.xxh128(buffer);
}
