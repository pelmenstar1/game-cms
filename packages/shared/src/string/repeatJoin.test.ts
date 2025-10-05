import { expect, test } from 'vitest';

import { repeatJoin } from './repeatJoin.js';

test.each<[string, string, number, string]>([
  ['a', ',', 3, 'a,a,a'],
  ['a', ',', 1, 'a'],
  ['a', ',', 0, ''],
])('repeatJoin', (value, delimiter, n, expected) => {
  const actual = repeatJoin(value, delimiter, n);

  expect(actual).toEqual(expected);
});
