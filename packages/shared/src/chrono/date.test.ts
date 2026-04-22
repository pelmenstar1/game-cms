import { describe, expect, test } from 'vitest';

import {
  daysFromMonday,
  isSameUTCDay,
  isSameUTCWeek,
  isValidDate,
} from './date.js';

describe('isValidDate', () => {
  test.each([
    ['2024-01-01', true],
    [0, true],
    ['invalid', false],
    [Number.NaN, false],
  ])('%s -> %s', (input, expected) => {
    const date = new Date(input);

    expect(isValidDate(date)).toBe(expected);
  });
});

describe('isSameUTCDay', () => {
  test.each<[string, string, boolean]>([
    ['2024-06-15T00:00:00Z', '2024-06-15T23:59:59Z', true], // same day, different times
    ['2024-06-15T00:00:00Z', '2024-06-16T00:00:00Z', false], // adjacent days
    ['2024-06-15T00:00:00Z', '2024-05-15T00:00:00Z', false], // same day number, different months
    ['2024-06-15T00:00:00Z', '2023-06-15T00:00:00Z', false], // same day+month, different years
  ])('%s + %s -> %s', (a, b, expected) => {
    expect(isSameUTCDay(new Date(a), new Date(b))).toBe(expected);
  });
});

describe('daysFromMonday', () => {
  test.each<[string, number]>([
    ['2024-06-10T00:00:00Z', 0], // Monday
    ['2024-06-11T00:00:00Z', 1], // Tuesday
    ['2024-06-12T00:00:00Z', 2], // Wednesday
    ['2024-06-13T00:00:00Z', 3], // Thursday
    ['2024-06-14T00:00:00Z', 4], // Friday
    ['2024-06-15T00:00:00Z', 5], // Saturday
    ['2024-06-16T00:00:00Z', 6], // Sunday
  ])('%s -> %i', (dateISO, expected) => {
    expect(daysFromMonday(new Date(dateISO))).toBe(expected);
  });
});

describe('isSameUTCWeek', () => {
  test.each<[string, string, boolean]>([
    ['2024-06-10T00:00:00Z', '2024-06-16T00:00:00Z', true], // Monday to Sunday of same week
    ['2024-06-12T00:00:00Z', '2024-06-10T00:00:00Z', true], // Wednesday and Monday of same week
    ['2024-06-15T00:00:00Z', '2024-06-15T00:00:00Z', true], // same date
    ['2024-06-15T00:00:00Z', '2024-06-17T00:00:00Z', false], // Saturday and next Monday
    ['2024-06-10T00:00:00Z', '2024-06-17T00:00:00Z', false], // two consecutive Mondays
  ])('%s + %s -> %s', (a, b, expected) => {
    expect(isSameUTCWeek(new Date(a), new Date(b))).toBe(expected);
  });
});
