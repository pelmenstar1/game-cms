import { isPromise } from './typecheck.js';
import type { MaybePromise } from './typeutil.js';

type InMemoryCacheGetArgs<K, Context> = Context extends undefined
  ? [key: K, context?: Context]
  : [key: K, context: Context];

type InMemoryCache<K, T, Context> = {
  get: (...args: InMemoryCacheGetArgs<K, Context>) => T;
};

export function createInMemoryCache<
  K extends PropertyKey,
  T,
  Context = undefined,
>(
  factory: (key: K, context: Context) => Promise<T>
): InMemoryCache<K, MaybePromise<T>, Context>;

export function createInMemoryCache<
  K extends PropertyKey,
  T,
  Context = undefined,
>(factory: (key: K, context: Context) => T): InMemoryCache<K, T, Context>;

/*@__NO_SIDE_EFFECTS__*/
export function createInMemoryCache<K extends PropertyKey, T, Context>(
  factory: (key: K, context: Context) => MaybePromise<T>
): InMemoryCache<K, MaybePromise<T>, Context> {
  const cache: Partial<Record<K, T>> = {};

  return {
    get: (key: K, context?: Context) => {
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
    },
  };
}
