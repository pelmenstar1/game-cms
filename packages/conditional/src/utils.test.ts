import { expect, test } from 'vitest';

import { findClosingBracketIndex } from './utils.js';

test.each<[string, number]>([
  ['(1)', 3],
  ['((1))', 5],
  ['(1) (1)', 3],
  ['(1 () 1)', 8],
])('findClosingBracketIndex/success', (input, expected) => {
  const actual = findClosingBracketIndex(input);

  expect(actual).toEqual(expected);
});
