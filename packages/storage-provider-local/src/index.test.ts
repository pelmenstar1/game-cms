import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';

import type { FileSource } from '@game-cms/base-core';
import { temporalDirectory } from '@game-cms/shared/io';
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

async function uploadAndCheckContent(content: FileSource) {
  await using provider = await createProvider();

  const { extra } = await provider.value.protocol.upload({
    name: '123',
    mime: 'text/plain',
    content,
  });

  return await fsp.readFile(path.join(provider.path, extra.fileName));
}

describe('localStorageProvider', () => {
  describe('uploadFile', () => {
    test('string', async () => {
      const expected = Buffer.from('123');
      const actual = await uploadAndCheckContent(expected);

      expect(actual).toEqual(expected);
    });

    test('buffer', async () => {
      const buffer = Buffer.from('123');
      const actual = await uploadAndCheckContent(buffer);

      expect(actual.equals(buffer)).toEqual(true);
    });

    test('stream', async () => {
      const buffer = Buffer.from('123');
      const stream = Readable.from([buffer]);
      const actual = await uploadAndCheckContent(stream);

      expect(actual.equals(buffer)).toEqual(true);
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
