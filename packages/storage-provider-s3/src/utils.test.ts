import { describe, expect, test } from 'vitest';

import type { S3StorageProviderConfig } from './types.js';
import { createFileKey, getFileUrl } from './utils.js';

describe('createFileKey', () => {
  test('known mime', () => {
    const actual = createFileKey('image/png');

    expect(actual.endsWith('.png'), actual).toBe(true);
  });

  test('unknown mime', () => {
    const actual = createFileKey('');

    expect(actual).toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    );
  });
});

test.each<[string, string, string]>([
  ['path', 'https://a.com', 'https://a.com/path'],
  ['/path', 'https://a.com/', 'https://a.com/path'],
])('getFileUrl', (key, base, expected) => {
  const actual = getFileUrl(
    { publicUrl: base } as S3StorageProviderConfig,
    key
  );

  expect(actual).toEqual(expected);
});
