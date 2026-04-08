import { ComponentOptionsById } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

import { Id } from '../types.js';

export function getDefaultData(options: ComponentOptionsById<Id>) {
  const result = options.minDate
    ? resolveDateLike(options.minDate)
    : new Date();

  return result;
}
