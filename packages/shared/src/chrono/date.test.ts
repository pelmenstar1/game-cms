import { describe, expect, test } from 'vitest';

import { getWeekday, toLocalISOString } from './date.js';

describe('toLocalISOString', () => {
  test('ok', () => {
    const date = new Date(2023, 11, 31, 21, 0, 0);
    const actual = toLocalISOString(date);

    expect(actual).toBe('2023-12-31T21:00:00.000Z');
  });
});

test.each<[string, number]>([
  ['2025-08-04', 1],
  ['2025-08-05', 2],
  ['2025-08-06', 3],
  ['2025-08-07', 4],
  ['2025-08-08', 5],
  ['2025-08-09', 6],
  ['2025-08-10', 7],
])('getWeekday', (input, expected) => {
  const actual = getWeekday(new Date(input));

  expect(actual).toEqual(expected);
});
