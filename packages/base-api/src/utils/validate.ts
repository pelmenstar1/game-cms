import { ApiError } from '@game-cms/utils';
import { ZodType } from 'zod';

export function apiValidateValue<T>(value: unknown, schema: ZodType<T>) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const { error } = result;

    throw new ApiError(
      'Schema validation issue',
      'base::schema/validation',
      error.issues
    );
  }

  return result.data;
}
