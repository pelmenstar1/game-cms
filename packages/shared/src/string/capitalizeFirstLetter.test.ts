import { expect, test } from 'vitest';

import { capitalizeFirstLetter } from './capitalizeFirstLetter.js';

test.each([
  ['abc', 'Abc'],
  ['1', '1'],
  ['аб', 'Аб'],
])('capitalizeFirstLetter', (input, expected) => {
  expect(capitalizeFirstLetter(input)).toBe(expected);
});
