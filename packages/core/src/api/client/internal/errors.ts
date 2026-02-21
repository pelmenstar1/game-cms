import { isNonNullObject, safeGetText } from '@game-cms/shared';
import { parseJsonOptional } from '@game-cms/shared/json';

import { ApiError } from '../../error.js';

export async function handleResponseError(response: Response) {
  const bodyString = await safeGetText(response);
  if (bodyString === null) {
    throw new Error('API error: cannot retrieve message');
  }

  const body = parseJsonOptional(bodyString);
  if (isNonNullObject(body)) {
    const { error } = body as { error?: unknown };

    if (isNonNullObject(error)) {
      const { message, code } = error;

      if (typeof message === 'string') {
        if (typeof code === 'string') {
          throw new ApiError(message, {
            api: code,
            http: response.status,
          });
        }

        throw new ApiError(message, { http: response.status });
      }
    }
  }

  throw new ApiError(bodyString, { http: response.status });
}
