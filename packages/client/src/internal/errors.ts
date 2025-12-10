import type { ApiErrorCode } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { isNonNullObject, parseJsonOptional } from '@game-cms/shared';

export async function handleResponseError(response: Response) {
  const bodyString = await response.text().catch(() => null);
  if (bodyString === null) {
    throw new Error(`API error: cannot retrieve message`);
  }

  const body = parseJsonOptional(bodyString);
  if (isNonNullObject(body) && 'error' in body) {
    const { error } = body;

    if (isNonNullObject(error) && 'message' in error) {
      const { message } = error;

      if (typeof message === 'string') {
        if ('code' in error) {
          const { code } = error;

          if (typeof code === 'string') {
            throw new ApiError(message, {
              api: code as ApiErrorCode,
              http: response.status,
            });
          }
        }

        throw new ApiError(message, { http: response.status });
      }
    }
  }

  throw new ApiError(bodyString, { http: response.status });
}
