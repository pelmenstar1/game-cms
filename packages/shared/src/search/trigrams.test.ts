import { describe, expect, test } from 'vitest';

import { buildTrigrams } from './trigrams.js';

describe('buildTrigrams', () => {
  test.each<[string, string[]]>([
    ['', ['   ']],
    ['a', ['  a', ' a ', 'a  ']],
    ['abc', ['  a', ' ab', 'abc', 'bc ', 'c  ']],
    ['ab', ['  a', ' ab', 'ab ', 'b  ']],
  ])('(%s) -> %j', (str, expected) => {
    expect(buildTrigrams(str)).toEqual(new Set(expected));
  });

  test('deduplicates repeated trigrams', () => {
    // 'aaaa' produces 'aaa' twice in the sliding window
    const result = buildTrigrams('aaaa');
    expect(result).toEqual(new Set(['  a', ' aa', 'aaa', 'aa ', 'a  ']));
  });
});
