import { expect, test } from 'vitest';

import type { Rect } from '../types.js';
import { inferRectsBounds } from './rect.js';

test.each<[Rect[], Rect]>([
  [
    [{ x: 10, y: 20, width: 100, height: 100 }],
    { x: 10, y: 20, width: 100, height: 100 },
  ],
  [
    [
      { x: 10, y: 20, width: 100, height: 100 },
      { x: 100, y: 30, width: 200, height: 100 },
    ],
    { x: 10, y: 20, width: 290, height: 110 },
  ],
])('inferRectsBounds', (rects, expected) => {
  const actual = inferRectsBounds(rects);

  expect(actual).toEqual(expected);
});
