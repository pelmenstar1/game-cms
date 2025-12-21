export function isNonNullObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return isNonNullObject(value) && 'then' in value;
}
