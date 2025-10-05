import { expect, test } from 'vitest';

import { parseHexString, toHexString } from './hex.js';

test.each<[number[]]>([
  [[]],
  [[0]],
  [[8]],
  [[10]],
  [[15]],
  [[100]],
  [[100, 200]],
  [[100, 200, 100]],
])('parseHexString/toHexString', (input) => {
  const hex = toHexString(input);
  const actual = parseHexString(hex);

  expect([...actual]).toEqual(input);
});
