import { expect, test } from 'vitest';

import { safeParseFloat } from './safeParseFloat.js';

test.each([
  ['123', 123],
  ['0', 0],
  ['+123', 123],
  ['-123', -123],
  ['123.45', 123.45],
  ['-123.1', -123.1],
  ['+0.5', 0.5],
  ['123.', null],
  ['-123.1.2', null],
  ['+', null],
  ['-', null],
  ['ab', null],
  ['', null],
])('safeParseFloat', (input, expected) => {
  const actual = safeParseFloat(input);

  expect(actual, `input: ${input}`).toEqual(expected);
});
