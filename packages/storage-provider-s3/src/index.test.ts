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

async function uploadAndCheckContent(content: FileSource) {
  const provider = createProvider();

  const extra = await provider.protocol.upload({
    name: '123',
    mime: 'text/plain',
    content,
  });

  return Buffer.from(await provider.protocol.getContent(extra));
}

describe.runIf('TEST_S3_API_URL' in process.env)('s3StorageProvider', () => {
  describe('uploadFile', () => {
    test('string', async () => {
      const actual = await uploadAndCheckContent('123');

      expect(actual.toString('utf8')).toEqual('123');
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

  test('getMeta', async () => {
    const provider = createProvider();

    const extra = await provider.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: '123',
    });

    const meta = await provider.protocol.getMeta(extra);

    expect(meta).toEqual({ size: 3 });
  });

  test('getContent', async () => {
    const provider = createProvider();

    const extra = await provider.protocol.upload({
      name: '123',
      mime: 'text/plain',
      content: '123',
    });

    const content = await provider.protocol.getContent(extra);

    expect(Buffer.from(content).toString('utf8')).toEqual('123');
  });
});
