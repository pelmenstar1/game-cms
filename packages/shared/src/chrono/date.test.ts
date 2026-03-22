import { describe, expect, test } from 'vitest';

import { isValidDate } from './date.js';

describe('isValidDate', () => {
  test('valid date', () => {
    const date = new Date(0);

    expect(isValidDate(date)).toBe(true);
  });

  test('invalid date', () => {
    const date = new Date('invalid');

    expect(isValidDate(date)).toBe(false);
  });
});
