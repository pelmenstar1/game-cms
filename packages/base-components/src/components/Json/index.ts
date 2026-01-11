import { ComponentSchema } from '@game-cms/core';
import { ZodType } from 'zod';

export function json<
  AllowEmpty extends boolean = false,
  T = unknown,
>(options?: {
  type?: ZodType<T>;
  allowEmpty?: AllowEmpty;
}): ComponentSchema<'base::json', { allowEmpty: AllowEmpty; type: T }> {
  return {
    componentId: 'base::json',
    options: {
      allowEmpty: options?.allowEmpty,
      type: options?.type as never,
    },
  };
}
