import { ApiError } from '@game-cms/core/api';
import { ZodType } from 'zod';

export function apiValidateValue<T>(value: unknown, schema: ZodType<T>) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const { error } = result;

    throw new ApiError('Schema validation issue', {
      code: 'base::schema/validation',
      details: error.issues,
    });
  }

  return result.data;
}
