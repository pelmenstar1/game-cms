import { expect, test } from 'vitest';

import {
  parseRelativeTimeToTotalSeconds,
  parseTimeSpec,
  type RelativeTime,
} from './relativeTime.js';

test.each<[RelativeTime, number]>([
  ['2h', 2 * 60 * 60],
  ['1s', 1],
])('parseRelativeTimeToTotalSeconds', (time, expected) => {
  const actual = parseRelativeTimeToTotalSeconds(time);

  expect(actual).toEqual(expected);
});

test.each<[string, number]>([
  ['2h', 2 * 60 * 60],
  ['2h 1m', 2 * 60 * 60 + 1 * 60],
])('parseTimeSpec', (input, expected) => {
  const actual = parseTimeSpec(input);

  expect(actual).toEqual(expected);
});
