import { ComponentSchema } from '@game-cms/core';
import { DateLike, resolveDateLike } from '@game-cms/shared/chrono';

import { Id, id } from './types.js';

export function date(options?: {
  minDate?: DateLike;
  maxDate?: DateLike;
}): ComponentSchema<Id> {
  return {
    componentId: id,
    options: {
      minDate: resolveDateLike(options?.minDate),
      maxDate: resolveDateLike(options?.maxDate),
    },
  };
}
