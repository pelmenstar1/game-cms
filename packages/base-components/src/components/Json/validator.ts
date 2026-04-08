import { ComponentOptionsById } from '@game-cms/core';

import { Id } from './types.js';

export function validator(data: unknown, options: ComponentOptionsById<Id>) {
  const { type } = options;
  if (type) {
    const result = type.safeParse(data);
    if (!result.success) {
      return 'INVALID_FORMAT';
    }
  }
}
