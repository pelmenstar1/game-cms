import { expect, test } from 'vitest';

import { isFloatString } from './isFloat.js';

test.each([
  ['123', true],
  ['0', true],
  ['+123', true],
  ['-123', true],
  ['-123.1', true],
  ['-123.', false],
  ['-123.1.2', false],
  ['+', false],
  ['-', false],
  ['ab', false],
  ['', false],
])('isFloat', (input, expected) => {
  const actual = isFloatString(input);

  expect(actual, `input: ${input}`).toEqual(expected);
});
