import path from 'node:path';
import { Readable } from 'node:stream';

import type { FileSource } from '@game-cms/base-core';
import { loadEnvFileIfExists } from '@game-cms/shared/io';
import { describe, expect, test } from 'vitest';

import { s3StorageProvider } from './index.js';

await loadEnvFileIfExists(path.join(import.meta.dirname, '../'), '.env.test');

function createProvider() {
  return s3StorageProvider({
    bucket: process.env.TEST_S3_BUCKET as string,
    publicUrl: 'http://localhost',
    client: {
      endpoint: process.env.TEST_S3_API_URL as string,
      region: 'auto',
      credentials: {
        accessKeyId: process.env.TEST_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.TEST_S3_SECRET_ACCESS_KEY as string,
      },
    },
  });
}

async function uploadAndCheckContent(content: FileSource, expected: Buffer) {
  const provider = createProvider();

  const { extra, size } = await provider.protocol.upload({
    name: '123',
    mime: 'text/plain',
    content,
  });

  const actual = await provider.protocol.getContent(extra);

  expect(expected.equals(actual)).toBe(true);
  expect(size).toEqual(expected.length);
}

describe.runIf('TEST_S3_API_URL' in process.env)('s3StorageProvider', () => {
  describe('uploadFile', () => {
    test('buffer', async () => {
      const expected = Buffer.from('123');

      await uploadAndCheckContent(expected, expected);
    });

    test('stream', async () => {
      const buffer = Buffer.from('123');
      const stream = Readable.from([buffer]);

      await uploadAndCheckContent(stream, buffer);
    });
  });

  test('getContent', async () => {
    const provider = createProvider();

    const expected = Buffer.from('123');
    const { extra } = await provider.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: expected,
    });

    const actual = await provider.protocol.getContent(extra);

    expect(expected.equals(actual)).toBe(true);
  });
});
