import { expect, test } from 'vitest';

import { getCookieValue } from './cookie.js';

test.each<[string, string, string | undefined]>([
  ['Name=123', 'Name', '123'],
  ['Name1=123; Name2=321', 'Name2', '321'],
  ['Name1=123; Name2=321', 'Name3', undefined],
])('getCookieValue', (cookie, key, expected) => {
  const actual = getCookieValue(cookie, key);

  expect(actual).toEqual(expected);
});
