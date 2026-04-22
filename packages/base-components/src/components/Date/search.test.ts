import { DAY_MS } from '@game-cms/shared/chrono';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { computeDateScore, createDateIndex } from './search.js';

const FIXED_NOW = new Date('2024-06-15T12:00:00Z'); // Saturday

describe('createDateIndex', () => {
  test('returns all tokens for a single-digit month and day', () => {
    const date = new Date('2024-01-05T00:00:00Z');

    expect(createDateIndex(date)).toEqual([
      '2024',
      '1',
      '01',
      'january',
      'jan',
      '5',
      '05',
      '2024-1',
      '2024-01',
      '2024-01-05',
    ]);
  });

  test('returns all tokens for a double-digit month and day', () => {
    const date = new Date('2023-11-15T00:00:00Z');

    expect(createDateIndex(date)).toEqual([
      '2023',
      '11',
      '11',
      'november',
      'nov',
      '15',
      '15',
      '2023-11',
      '2023-11',
      '2023-11-15',
    ]);
  });
});

describe('computeDateScore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('relative keywords', () => {
    test.each<[string, string, number]>([
      ['today', '2024-06-15T08:00:00Z', 1],
      ['today', '2024-06-14T08:00:00Z', 0],
      ['yesterday', '2024-06-14T08:00:00Z', 1],
      ['yesterday', '2024-06-15T08:00:00Z', 0],
      ['this week', '2024-06-12T00:00:00Z', 1], // Wednesday of same week
      ['this week', '2024-06-03T00:00:00Z', 0], // previous week
      ['this month', '2024-06-01T00:00:00Z', 1],
      ['this month', '2024-05-15T00:00:00Z', 0],
      ['this month', '2023-06-15T00:00:00Z', 0], // same month, different year
      ['this year', '2024-01-01T00:00:00Z', 1],
      ['this year', '2023-06-15T00:00:00Z', 0],
      // normalization
      ['TODAY', '2024-06-15T08:00:00Z', 1],
      ['  today  ', '2024-06-15T08:00:00Z', 1],
    ])('"%s" + %s -> %i', (query, storageISO, expected) => {
      expect(computeDateScore(query, new Date(storageISO), [])).toBe(expected);
    });
  });

  describe('index prefix matching', () => {
    const storage = new Date('2024-06-15T00:00:00Z');
    const index = createDateIndex(storage);

    test.each<[string, number]>([
      ['2024', 1],
      ['jun', 1],
      ['2024-06-15', 1],
      ['xyz', 0],
    ])('"%s" -> %i', (query, expected) => {
      expect(computeDateScore(query, storage, index)).toBe(expected);
    });
  });

  describe('proximity scoring', () => {
    const storage = new Date('2024-03-10T00:00:00Z');

    test.each<[string, number]>([
      ['2024-03-10', 1],
      ['2024-03-13', 0],
      ['2024-03-20', 0],
      ['not-a-date', 0],
    ])('"%s" -> %f', (query, expected) => {
      expect(computeDateScore(query, storage, [])).toBe(expected);
    });

    test('returns a partial score for a date 1 day away', () => {
      const score = computeDateScore('2024-03-11', storage, []);
      expect(score).toBeCloseTo(1 - DAY_MS / (3 * DAY_MS), 10);
    });
  });
});
