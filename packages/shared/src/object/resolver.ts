import {
  type MaybeAsyncFactory,
  resolveAsyncMaybeFactory,
} from '../maybeFactory.js';
import type { MaybePromise } from '../typeutil.js';

export type ObjectFunctionResolver<T, Args extends unknown[] = []> = (
  ...args: Args
) => MaybePromise<T>;

export type ObjectMapResolver<T, Args extends unknown[] = []> = {
  [K in keyof T]: MaybeAsyncFactory<T[K], Args>;
};

export type ObjectResolver<T, Args extends unknown[] = []> =
  | ObjectFunctionResolver<T, Args>
  | ObjectMapResolver<T, Args>;

export async function resolveObject<T, Args extends unknown[]>(
  resolver: ObjectResolver<T, Args>,
  ...args: Args
): Promise<T> {
  if (typeof resolver === 'function') {
    return resolver(...args);
  }

  const entries = await Promise.all(
    Object.entries(resolver).map(
      async ([key, func]) =>
        [
          key,
          await resolveAsyncMaybeFactory(
            func as MaybeAsyncFactory<object, Args>,
            ...args
          ),
        ] as const
    )
  );

  return Object.fromEntries(entries) as T;
}
