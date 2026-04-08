import { ComponentSchema } from '@game-cms/core';
import { ZodType } from 'zod';

import { Id, id } from './types.js';

export function json<
  AllowEmpty extends boolean = false,
  T = unknown,
>(options?: {
  type?: ZodType<T>;
  allowEmpty?: AllowEmpty;
}): ComponentSchema<Id, { allowEmpty: AllowEmpty; type: T }> {
  return {
    componentId: id,
    options: {
      allowEmpty: options?.allowEmpty,
      type: options?.type as never,
    },
  };
}
