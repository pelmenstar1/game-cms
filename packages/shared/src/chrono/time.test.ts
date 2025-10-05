import { expect, test } from 'vitest';

import { findNearestTimePoint, getLocalDate, type Time } from './time.js';

const points: Time[] = [
  '8:30',
  '10:25',
  '12:20',
  '14:15',
  '16:10',
  '18:30',
  '20:20',
];

test.each<[Time, Time]>([
  ['8:30', '8:30'],
  ['10:25', '10:25'],
  ['10:24', '10:25'],
  ['12:00', '12:20'],
])('findNearestTimePoint', (target, expected) => {
  const actual = findNearestTimePoint(points, target);

  expect(actual).toEqual(expected);
});

test('getLocalDate', () => {
  const date = new Date(2025, 8, 2);

  const actual = getLocalDate(date, 'Europe/Kiev');

  expect(actual).toEqual(new Date(2025, 8, 2, 3));
});
