import { ComponentErrorById } from '@game-cms/core';

import { Id } from './types.js';

export function validator(data: unknown): ComponentErrorById<Id> | undefined {
  if (data !== null && typeof data !== 'string') {
    return 'INVALID_TYPE';
  }
}
