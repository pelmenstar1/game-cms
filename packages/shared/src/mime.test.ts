import { expect, test } from 'vitest';

import { matchMime } from './mime.js';

test.each([
  ['image/png', 'image/*', true],
  ['application/json', 'image/*', false],
  ['image/png', 'image/png', true],
])('matchMime', (value, pattern, expected) => {
  const actual = matchMime(value, pattern);

  expect(actual).toEqual(expected);
});
