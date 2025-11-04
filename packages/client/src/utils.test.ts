import { expect, test } from 'vitest';

import { createFullUrl } from './utils.js';

test.each<[string, string, string]>([
  ['/123', 'https://a.com', 'https://a.com/123'],
  ['123', 'https://a.com', 'https://a.com/123'],
  ['123', 'https://a.com/', 'https://a.com/123'],
  ['/123', 'https://a.com/', 'https://a.com/123'],

  ['/123', '/api', '/api/123'],
  ['123', '/api', '/api/123'],
  ['/123', '/api/', '/api/123'],
  ['123', '/api/', '/api/123'],
])('createFullUrl', (input, base, expected) => {
  const actual = createFullUrl(input, base);

  expect(actual.toString()).toEqual(expected);
});
