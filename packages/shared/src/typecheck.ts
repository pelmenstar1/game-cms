export function isNonNullObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}
