import { ComponentErrorById } from '@game-cms/core';

export function validator(
  data: unknown
): ComponentErrorById<'base::entity-reference'> | undefined {
  if (typeof data !== 'string') {
    return 'INVALID_TYPE';
  }
}
