import { ComponentOptionsById } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

import { Id } from './types.js';

export function validator(date: Date, options: ComponentOptionsById<Id>) {
  const time = date.getTime();

  if (options.minDate && time < resolveDateLike(options.minDate).getTime()) {
    return 'TOO_EARLY';
  }

  if (options.maxDate && time > resolveDateLike(options.maxDate).getTime()) {
    return 'TOO_LATE';
  }
}
