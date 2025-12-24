/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { MaybePromise } from './typeutil.js';

export type MaybeFactory<T, Args extends unknown[] = []> =
  | T
  | ((...args: Args) => T);

export type MaybeAsyncFactory<T, Args extends unknown[] = []> =
  | T
  | ((...args: Args) => MaybePromise<T>);

export function resolveMaybeFactory<T, Args extends unknown[]>(
  factory: MaybeFactory<T, Args>,
  ...args: Args
): T {
  // @ts-expect-error Typescript doesn't let to call a function :(
  return typeof factory === 'function' ? factory(...args) : factory;
}

export async function resolveAsyncMaybeFactory<T, Args extends unknown[]>(
  factory: MaybeAsyncFactory<T, Args>,
  ...args: Args
): Promise<T> {
  return await resolveMaybeFactory(factory, ...args);
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
