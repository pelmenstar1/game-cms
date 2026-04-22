import { ComponentErrorById, ComponentOptionsById } from '@game-cms/core';
import { isValidDate, resolveDateLike } from '@game-cms/shared/chrono';

import { Id } from './types.js';

export function validator(
  date: Date,
  options: ComponentOptionsById<Id>
): ComponentErrorById<Id> | undefined {
  if (!isValidDate(date)) {
    return 'INVALID_TYPE';
  }

  const time = date.getTime();

  if (options.minDate && time < resolveDateLike(options.minDate).getTime()) {
    return 'TOO_EARLY';
  }

  if (options.maxDate && time > resolveDateLike(options.maxDate).getTime()) {
    return 'TOO_LATE';
  }
}
