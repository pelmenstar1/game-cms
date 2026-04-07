import { describe, expect, test } from 'vitest';

import { resizeArray } from './resize.js';

describe('resizeArray', () => {
  test.each<[readonly number[], number, number, number[]]>([
    [[1, 2, 3], 5, 0, [1, 2, 3, 0, 0]],
    [[1, 2, 3], 3, 0, [1, 2, 3]],
    [[1, 2, 3], 2, 0, [1, 2]],
    [[], 3, 9, [9, 9, 9]],
    [[1], 1, 0, [1]],
    [[], 0, 0, []],
  ])('numbers: (%j, %i, %i) -> %j', (array, size, placeholder, expected) => {
    expect(resizeArray(array, size, placeholder)).toEqual(expected);
  });

  test('preserves original array when same size', () => {
    const original = [1, 2, 3] as const;
    const result = resizeArray(original, 3, 0);

    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(original);
  });
});
