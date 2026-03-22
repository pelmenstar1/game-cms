import { isPromise } from './typecheck.js';

export type MaybePromise<T> = T | Promise<T>;

export function maybePromiseThen<T, R>(
  value: MaybePromise<T>,
  thenBlock: (result: T) => R
): MaybePromise<R> {
  return isPromise(value) ? value.then(thenBlock) : thenBlock(value);
}

export function maybePromiseCatch<T>(
  block: () => MaybePromise<T>,
  catchBlock: (error: unknown) => void
) {
  try {
    const result = block();

    if (isPromise(result)) {
      result.catch(catchBlock);
    }
  } catch (error: unknown) {
    catchBlock(error);
  }
}
