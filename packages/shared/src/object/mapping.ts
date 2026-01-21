import type { MaybePromise } from '../typeutil.js';
import type { UnknownObject } from './types.js';

type ObjectMapping<T, R> = (value: T[keyof T], key: keyof T) => R;

export function mapObject<T extends UnknownObject, R>(
  obj: T,
  mapping: ObjectMapping<T, R>
) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([key, value]) => [key, mapping(value as T[keyof T], key)] as const
    )
  ) as Record<keyof T, R>;
}

export async function asyncMapObject<T extends UnknownObject, R>(
  obj: T,
  mapping: ObjectMapping<T, MaybePromise<R>>
) {
  const result = await Promise.all(
    Object.entries(obj).map(
      async ([key, value]) =>
        [key, await mapping(value as T[keyof T], key)] as const
    )
  );

  return Object.fromEntries(result) as Record<keyof T, R>;
}
