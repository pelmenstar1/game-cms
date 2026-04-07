import { describe, expect, test } from 'vitest';

import { withUpdatedItem } from './update.js';

describe('withUpdatedItem', () => {
  test.each([
    { array: [1, 2, 3], index: 1, newItem: 99, expected: [1, 99, 3] },
    {
      array: ['a', 'b', 'c'],
      index: 0,
      newItem: 'z',
      expected: ['z', 'b', 'c'],
    },
    { array: [10, 20, 30], index: 2, newItem: 0, expected: [10, 20, 0] },
  ])('replaces item at index $index', ({ array, index, newItem, expected }) => {
    expect(withUpdatedItem(array, index, newItem)).toEqual(expected);
  });

  test('does not mutate the original array', () => {
    const original = [1, 2, 3];
    withUpdatedItem(original, 0, 99);
    expect(original).toEqual([1, 2, 3]);
  });
});
