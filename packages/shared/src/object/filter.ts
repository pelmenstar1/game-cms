import type { UnknownObject } from './types.js';

export function filterObject<T extends UnknownObject>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => unknown
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) =>
      predicate(value as T[keyof T], key)
    )
  ) as T;
}
