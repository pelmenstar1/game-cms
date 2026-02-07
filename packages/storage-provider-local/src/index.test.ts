import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

import type { FileSource } from '@game-cms/base-core';
import { temporalDirectory } from '@game-cms/shared/node/io';
import { describe, expect, test } from 'vitest';

import { localStorageProvider } from './index.js';

async function createProvider() {
  const result = await temporalDirectory();

  return {
    value: localStorageProvider({ storagePath: result.path }),
    path: result.path,
    [Symbol.asyncDispose]: result[Symbol.asyncDispose],
  };
}

async function uploadAndCheckContent(content: FileSource, expected: Buffer) {
  await using provider = await createProvider();

  const { extra, size } = await provider.value.protocol.upload({
    name: '123',
    mime: 'text/plain',
    content,
  });

  const actual = await fsp.readFile(path.join(provider.path, extra.fileName));

  expect(actual.equals(expected)).toEqual(true);
  expect(size).toEqual(expected.length);
}

describe('localStorageProvider', () => {
  describe('uploadFile', () => {
    test('buffer', async () => {
      const buffer = Buffer.from('123');

      await uploadAndCheckContent(buffer, buffer);
    });

    test('stream', async () => {
      const buffer = Buffer.from('123');
      const stream = Readable.from([buffer]);

      await uploadAndCheckContent(stream, buffer);
    });
  });

  test('delete', async () => {
    await using provider = await createProvider();

    const { extra } = await provider.value.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: Buffer.from('123'),
    });

    const filePath = path.join(provider.path, extra.fileName);

    expect(fs.existsSync(filePath)).toEqual(true);

    await provider.value.protocol.delete(extra);

    expect(fs.existsSync(filePath)).toEqual(false);
  });

  test('getContent', async () => {
    await using provider = await createProvider();

    const expected = Buffer.from('123');

    const { extra } = await provider.value.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: expected,
    });

    const actual = await provider.value.protocol.getContent(extra);

    expect(actual).toEqual(expected);
  });
});
