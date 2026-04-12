import { expect, test } from 'vitest';

import { roundToNearestMultiple } from './math.js';

test.each<[number, number, number]>([
  [10, 5, 10],
  [11, 5, 10],
  [13, 5, 15],
  [15, 5, 15],
  [1, 10, 0],
  [0, 5, 0],
  [0.1, 0.5, 0],
  [0.5, 0.5, 0.5],
  [0.6, 0.5, 0.5],
  [-3, 5, -5],
  [-5, 5, -5],
  [-6, 5, -5],
])('roundToNearestMultiple(%s, %s) -> %s', (value, step, expected) => {
  expect(roundToNearestMultiple(value, step)).toBe(expected);
});
