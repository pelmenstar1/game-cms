import { ComponentOptionsById } from '@game-cms/core';

import { Id } from './types.js';

export function validator(data: unknown, options: ComponentOptionsById<Id>) {
  if (options.items.every(({ key }) => data !== key)) {
    return 'INVALID_TYPE';
  }
}
