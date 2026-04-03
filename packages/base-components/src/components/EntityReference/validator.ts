import { ComponentErrorById } from '@game-cms/core';

export function validator(
  data: unknown
): ComponentErrorById<'base::entity-reference'> | undefined {
  if (data !== null && typeof data !== 'string') {
    return 'INVALID_TYPE';
  }
}
