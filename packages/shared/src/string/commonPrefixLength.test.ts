import { describe, expect, test } from 'vitest';

import { commonPrefixLength } from './commonPrefixLength.js';

describe('commonPrefixLength', () => {
  test.each<[string, string, number]>([
    ['abc', 'abc', 3],
    ['abc', 'abd', 2],
    ['abc', 'xyz', 0],
    ['', '', 0],
    ['abc', '', 0],
    ['', 'abc', 0],
    ['a', 'a', 1],
    ['abcdef', 'abc', 3],
    ['abc', 'abcdef', 3],
  ])('(%s, %s) -> %i', (s1, s2, expected) => {
    expect(commonPrefixLength(s1, s2)).toBe(expected);
  });

  describe('with limit', () => {
    test.each<[string, string, number, number]>([
      ['abcdef', 'abcxyz', 3, 3],
      ['abcdef', 'abcxyz', 2, 2],
      ['abcdef', 'abcxyz', 0, 0],
      ['abcdef', 'xyz', 4, 0],
      ['abcdef', 'abcdef', 4, 4],
    ])('(%s, %s, limit=%i) -> %i', (s1, s2, limit, expected) => {
      expect(commonPrefixLength(s1, s2, limit)).toBe(expected);
    });
  });
});
