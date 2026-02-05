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

export function maybeArrayFlatMap<T, R>(
  target: MaybeArray<T>,
  mapping: (value: T) => MaybeArray<R>
): MaybeArray<R> {
  return Array.isArray(target) ? target.flatMap(mapping) : mapping(target);
}

export function maybeArrayIncludes<T>(
  target: MaybeArray<T>,
  value: T
): boolean {
  return Array.isArray(target) ? target.includes(value) : target === value;
}

export function normalizeMaybeArray<T>(target: MaybeArray<T>): T[] {
  return Array.isArray(target) ? target : [target];
}
