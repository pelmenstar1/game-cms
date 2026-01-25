export type Point = { x: number; y: number };
export type Size = { width: number; height: number };

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function clampNumber(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, fraction: number) {
  return start + (end - start) * fraction;
}

export function rectsIntersect(a: Rect, b: Rect) {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}
