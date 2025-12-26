export function clampNumber(min: number, max: number, value: number) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, fraction: number) {
  return start + (end - start) * fraction;
}
