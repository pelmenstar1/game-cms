import { expect, test } from 'vitest';

import { deepEquals } from './equals.js';
import type { PlainValue } from './types.js';

test.each([
  // primitives
  [1, 1, true],
  [1, 2, false],
  ['a', 'a', true],
  ['a', 'b', false],
  [true, true, true],
  [true, false, false],
  [null, null, true],
  [null, undefined, false],
  [undefined, undefined, true],

  // arrays
  [[], [], true],
  [[1, 2], [1, 2], true],
  [[1, 2], [2, 1], false],
  [[1], [1, 2], false],
  [[1, [2, 3]], [1, [2, 3]], true],
  [[1, [2, 3]], [1, [2, 4]], false],
  [[], {}, false],

  // objects
  [{}, {}, true],
  [{ a: 1 }, { a: 1 }, true],
  [{ a: 1 }, { a: 2 }, false],
  [{ a: 1 }, { b: 1 }, false],
  [{ a: 1, b: 2 }, { a: 1 }, false],
  [{ a: { b: 1 } }, { a: { b: 1 } }, true],
  [{ a: { b: 1 } }, { a: { b: 2 } }, false],
  [{}, null, false],
  [{}, 1, false],

  // mixed nested
  [{ a: [1, 2] }, { a: [1, 2] }, true],
  [{ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }, true],
  [{ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }, false],
])('deepEquals', (a, b, expected) => {
  expect(deepEquals(a as PlainValue, b as PlainValue)).toBe(expected);
});
