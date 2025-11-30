import type { MaybePromise } from './typeutil.js';

export type MaybeFactory<T, Args extends unknown[] = []> =
  | T
  | ((...args: Args) => T);

export type MaybeAsyncFactory<T, Args extends unknown[] = []> =
  | T
  | ((...args: Args) => MaybePromise<T>);

export function resolveMaybeFactory<T extends object, Args extends unknown[]>(
  factory: MaybeFactory<T, Args>,
  ...args: Args
): T {
  return typeof factory === 'function' ? factory(...args) : factory;
}

export async function resolveAsyncMaybeFactory<
  T extends object | string,
  Args extends unknown[],
>(factory: MaybeAsyncFactory<T, Args>, ...args: Args): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return typeof factory === 'function' ? await factory(...args) : factory;
}

export function combineAsyncFactories<T, Args extends unknown[]>(
  ...factories: MaybeAsyncFactory<T[], Args>[]
): MaybeAsyncFactory<T[], Args> {
  return async (...args: Args) => {
    const result = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/await-thenable
      factories.map((factory) => resolveMaybeFactory(factory, ...args))
    );

    return result.flat();
  };
}
