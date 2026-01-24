import { ComponentOptionsById } from '@game-cms/core';
import { resolveDateLike } from '@game-cms/shared/chrono';

export function getDefaultData(options: ComponentOptionsById<'base::date'>) {
  const result = options.minDate
    ? resolveDateLike(options.minDate)
    : new Date();

  return result;
}
