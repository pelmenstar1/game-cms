import type { Rect } from '../types.js';

export function isContainedIn(a: Rect, b: Rect) {
  return (
    a.x >= b.x &&
    a.y >= b.y &&
    a.x + a.width <= b.x + b.width &&
    a.y + a.height <= b.y + b.height
  );
}

export function inferRectsBounds(rects: Rect[]): Rect {
  if (rects.length === 0) {
    throw new Error('Rects is empty');
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const { x, y, width, height } of rects) {
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x + width);
    bottom = Math.max(bottom, y + height);
  }

  return { x: left, y: top, width: right - left, height: bottom - top };
}
