import { isPromise } from './typecheck.js';

export type MaybePromise<T> = T | Promise<T>;

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
