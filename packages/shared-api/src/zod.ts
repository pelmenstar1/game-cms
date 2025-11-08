import { ZodType } from 'zod';

import { ApiError, ApiErrorCode } from './error.js';

export function apiValidateValue<T>(value: unknown, schema: ZodType<T>) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const { error } = result;

    throw new ApiError(
      'Schema validation issue',
      ApiErrorCode.VALIDATION_ISSUE,
      error.issues
    );
  }

  return result.data;
}
