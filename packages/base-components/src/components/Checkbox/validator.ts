import { ComponentOptionsById } from '@game-cms/core';

import { Id } from './types.js';

export function validator(data: unknown, options: ComponentOptionsById<Id>) {
  if (!Array.isArray(data) || data.some((item) => !(item in options.choices))) {
    return 'INVALID_TYPE';
  }
}
