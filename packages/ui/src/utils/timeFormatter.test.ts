import { expect, test } from 'vitest';

import { formatTimeSpec } from './timeFormatter';

test.each<[string, string]>([
  ['1h', '1 hour'],
  ['1h 2m', '1 hour, 2 minutes'],
  ['5s 1h 2m', '1 hour, 2 minutes, 5 seconds'],
])('formatTimeSpec', (input, expected) => {
  const actual = formatTimeSpec(input);

  expect(actual).toEqual(expected);
});
