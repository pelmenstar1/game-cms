import { expect, test } from 'vitest';

import { formatSearchParams } from './searchParams.js';

test.each([
  {
    input: { str: 'value', num: 123, bool: true },
    expected: 'str=value&num=123&bool=true',
  },
  {
    input: { a: null, b: undefined },
    expected: 'a=null',
  },
  {
    input: {},
    expected: '',
  },
  {
    input: { arr: ['a', 'b', 'c'] },
    expected: 'arr=a&arr=b&arr=c',
  },
])('formatSearchParams', ({ input, expected }) => {
  expect(formatSearchParams(input)).toBe(expected);
});
