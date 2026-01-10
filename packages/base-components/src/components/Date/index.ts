import { ComponentSchema } from '@game-cms/core';
import { DateLike, resolveDateLike } from '@game-cms/shared/chrono';

export function date(options?: {
  minDate?: DateLike;
  maxDate?: DateLike;
}): ComponentSchema<'base::date'> {
  return {
    componentId: 'base::date',
    options: {
      minDate: resolveDateLike(options?.minDate),
      maxDate: resolveDateLike(options?.maxDate),
    },
  };
}
