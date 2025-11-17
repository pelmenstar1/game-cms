import { expect, test } from 'vitest';

import {
  parseRelativeTimeToTotalSeconds,
  type RelativeTime,
} from './relativeTime.js';

test.each<[RelativeTime, number]>([
  ['2h', 2 * 60 * 60],
  ['1s', 1],
])('parseRelativeTimeToTotalSeconds', (time, expected) => {
  const actual = parseRelativeTimeToTotalSeconds(time);

  expect(actual).toEqual(expected);
});
