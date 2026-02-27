import type { MaybePromise } from './maybePromise.js';
import { isPromise } from './typecheck.js';

type InMemoryCacheGetArgs<K, Context> = Context extends undefined
  ? [key: K, context?: Context]
  : [key: K, context: Context];

type CachedFactory<K, T, Context> = (
  ...args: InMemoryCacheGetArgs<K, Context>
) => T;

export function createCachedFactory<
  K extends PropertyKey,
  T,
  Context = undefined,
>(
  factory: (key: K, context: Context) => Promise<T>
): CachedFactory<K, MaybePromise<T>, Context>;

export function createCachedFactory<
  K extends PropertyKey,
  T,
  Context = undefined,
>(factory: (key: K, context: Context) => T): CachedFactory<K, T, Context>;

/*@__NO_SIDE_EFFECTS__*/
export function createCachedFactory<K extends PropertyKey, T, Context>(
  factory: (key: K, context: Context) => MaybePromise<T>
): CachedFactory<K, MaybePromise<T>, Context> {
  const cache: Partial<Record<K, T>> = {};

  return (key: K, context?: Context) => {
    let result: T | undefined = cache[key];
    if (result === undefined) {
      const factoryResult = factory(key, context as Context);

      if (isPromise(factoryResult)) {
        return factoryResult.then((result): T => {
          cache[key] = result;

          return result;
        });
      }

      result = factoryResult;
      cache[key] = result;
    }

    return result;
  };
}

/*@__NO_SIDE_EFFECTS__*/
export function createCachedFactorySelfKeyed<T, Context = undefined>(
  factory: (context: Context) => { value: () => T; key: PropertyKey }
) {
  const cache: Partial<Record<PropertyKey, T>> = {};

  return (context: Context) => {
    const { value, key } = factory(context);

    return (cache[key] ??= value());
  };
}
