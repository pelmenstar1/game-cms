import { expect, test } from 'vitest';

import { findClosingQuoteIndex } from './tokenizer.js';

test.each<[string, number]>([
  [`123'`, 4],
  [String.raw`12\'12'`, 7],
])('findClosingQuoteIndex', (input, expected) => {
  const actual = findClosingQuoteIndex(input);

  expect(actual).toEqual(expected);
});
