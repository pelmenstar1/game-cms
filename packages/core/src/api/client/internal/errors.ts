import { isNonNullObject, safeGetText } from '@game-cms/shared';
import { parseJsonOptional } from '@game-cms/shared/json';

import { ApiError, ApiErrorCode } from '../../error.js';

export async function handleResponseError(response: Response) {
  const bodyString = await safeGetText(response);
  if (bodyString === null) {
    throw new Error('API error: cannot retrieve message');
  }

  const body = parseJsonOptional(bodyString);

  let errorMessage = bodyString;
  let errorCode: ApiErrorCode | undefined;
  let errorDetails: unknown;

  if (isNonNullObject(body)) {
    const { error } = body;

    if (isNonNullObject(error)) {
      const { message, code, details } = error;

      if (typeof message === 'string') {
        errorMessage = message;
      }

      if (typeof code === 'string') {
        errorCode = code;
      }

      if (details !== undefined) {
        errorDetails = details;
      }
    }
  }

  throw new ApiError(errorMessage, {
    code: errorCode,
    httpCode: response.status,
    details: errorDetails,
  });
}
