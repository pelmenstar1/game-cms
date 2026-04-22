import { ComponentOptionsById } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

import { Id } from '../types.js';

export function getDefaultData(options: ComponentOptionsById<Id>) {
  const { minDate } = options;

  if (minDate !== undefined) {
    return resolveDateLike(minDate);
  }

  return new Date();
}
