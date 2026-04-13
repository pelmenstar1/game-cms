import type { UnknownObject } from './types.js';

type OmitUndefined<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

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

export function omitUndefined<T extends UnknownObject>(
  obj: T
): OmitUndefined<T> {
  const result = { ...obj };

  for (const key in obj) {
    const value = obj[key];

    if (value === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete result[key];
    }
  }

  return result;
}
