import type { ApiErrorCode } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { isNonNullObject, parseJsonOptional } from '@game-cms/shared';

export async function handleResponseError(response: Response) {
  const bodyString = await response.text().catch(() => null);
  if (bodyString === null) {
    throw new Error(`API error: cannot retrieve message`);
  }

  const body = parseJsonOptional(bodyString);
  if (isNonNullObject(body)) {
    const { error } = body as { error?: unknown };

    if (isNonNullObject(error)) {
      const { message, code } = error as { message?: unknown; code?: unknown };

      if (typeof message === 'string') {
        if (typeof code === 'string') {
          throw new ApiError(message, {
            api: code as ApiErrorCode,
            http: response.status,
          });
        }

        throw new ApiError(message, { http: response.status });
      }
    }
  }

  throw new ApiError(bodyString, { http: response.status });
}
