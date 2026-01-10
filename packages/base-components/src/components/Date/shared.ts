import {
  ComponentDataValidator,
  ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

const id = 'base::date';

type Id = typeof id;

export const meta = componentMeta({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = (options) => {
  const result = options.minDate
    ? resolveDateLike(options.minDate)
    : new Date();

  return result.toString();
};

export const validator: ComponentDataValidator<Id> = (data, options) => {
  if (typeof data !== 'string') {
    return 'INVALID_TYPE';
  }

  const date = Date.parse(data);

  if (options.minDate && date < resolveDateLike(options.minDate).getTime()) {
    return 'TOO_EARLY';
  }

  if (options.maxDate && date > resolveDateLike(options.maxDate).getTime()) {
    return 'TOO_LATE';
  }
};
