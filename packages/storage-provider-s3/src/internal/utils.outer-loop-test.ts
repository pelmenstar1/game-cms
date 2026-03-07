import { S3Client } from '@aws-sdk/client-s3';
import { beforeAll, describe, expect, test } from 'vitest';

import { S3StorageProviderConfig } from '../types.js';
import { getTestConfig, loadTestEnv } from './testUtils.js';
import { baseUpload, createFileKey, getFileUrl } from './utils.js';

describe('getFileUrl', () => {
  beforeAll(async () => {
    await loadTestEnv();
  });

  test('presign URL', async () => {
    const config: S3StorageProviderConfig = {
      ...getTestConfig(),
      presignConfig: { enabled: true, expiresIn: 3600 },
    };

    const client = new S3Client(config.client);

    const mime = 'image/png';
    const fileKey = createFileKey(mime, 'image.png');
    const fileContent = Buffer.from('test', 'utf8');

    await baseUpload(client, config.bucket, fileKey, fileContent, mime);

    const signedUrl = await getFileUrl({ client, config }, fileKey);

    const response = await fetch(signedUrl);
    const actualContent = await response.bytes();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(mime);
    expect(fileContent.equals(actualContent)).toBe(true);
  });
});
