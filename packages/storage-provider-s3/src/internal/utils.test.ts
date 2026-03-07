import { S3Client } from '@aws-sdk/client-s3';
import { beforeAll, describe, expect, test } from 'vitest';

import { getTestConfig, loadTestEnv } from './testUtils.js';
import { createFileKey, getFileUrl } from './utils.js';

describe('createFileKey', () => {
  test('known mime', () => {
    const actual = createFileKey('image/png', 'image.png');

    expect(actual.endsWith('.png'), actual).toBe(true);
  });

  test('unknown mime', () => {
    const actual = createFileKey('', 'name');

    expect(actual).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    );
  });
});

describe('getFileUrl', () => {
  beforeAll(async () => {
    await loadTestEnv();
  });

  test.each<[string, string, string]>([
    ['path', 'https://a.com', 'https://a.com/path'],
    ['/path', 'https://a.com/', 'https://a.com/path'],
  ])('public URL', (key, base, expected) => {
    const config = getTestConfig();

    const actual = getFileUrl(
      {
        client: new S3Client(config.client),
        config: {
          client: config.client,
          bucket: config.bucket,
          publicUrl: base,
        },
      },
      key
    );
    expect(actual).toEqual(expected);
  });
});
