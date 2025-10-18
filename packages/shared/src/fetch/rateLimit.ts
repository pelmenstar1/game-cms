import { delay } from '../delay.js';
import { isErrorWithStatus } from './error.js';

const MIN_DELAY = 100;
const MAX_DELAY = 2000;
const MAX_RETRIES = 10;

function isRetryError(error: unknown): boolean {
  return isErrorWithStatus(error, 403);
}

export async function rateLimitOnFetch<R>(
  factory: () => Promise<R>
  // @ts-expect-error Typescript doesn't know that the function never returns in the end.
): Promise<R> {
  let delayMs = MIN_DELAY;
  let multiplier = 2;

  let lastError: unknown;

  for (let i = 0; i < MAX_RETRIES; i += 1) {
    try {
      return await factory();
    } catch (error: unknown) {
      lastError = error;

      if (isRetryError(error)) {
        await delay(delayMs);

        delayMs = Math.min(MAX_DELAY, delayMs * multiplier);
        multiplier *= 2;
      } else {
        throw error;
      }
    }
  }

  if (lastError !== undefined) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw lastError;
  }
}
