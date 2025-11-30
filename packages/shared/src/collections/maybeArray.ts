/* eslint-disable unicorn/no-array-callback-reference */
export type MaybeArray<T> = T | T[];

export function maybeArraySome<T>(
  target: MaybeArray<T>,
  predicate: (value: T) => boolean
) {
  return Array.isArray(target) ? target.some(predicate) : predicate(target);
}

export function maybeArrayMap<T, R>(
  target: MaybeArray<T>,
  mapping: (value: T) => R
): MaybeArray<R> {
  return Array.isArray(target) ? target.map(mapping) : mapping(target);
}
