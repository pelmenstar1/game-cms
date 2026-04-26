import { delay } from './delay.js';
import type { MaybePromise } from './maybePromise.js';

export type RetryOptions = {
  count: number;
  delay: number;
};

export async function asyncRetryOnError<R>(
  fn: () => MaybePromise<R>,
  options: RetryOptions
) {
  if (options.count <= 0) {
    throw new Error('Retry count must be greater than 0');
  }

  let lastError: unknown;

  for (let i = 0; i < options.count; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      await delay(options.delay);
    }
  }

  throw lastError;
}
