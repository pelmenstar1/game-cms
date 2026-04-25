import { ComponentErrorById } from '@game-cms/core';

import { Id } from './internal/types.js';

export function validator<S = unknown>(
  data: unknown,
  fns: {
    validateItem: (data: S) => unknown;
    validateStructure?: (data: unknown[]) => data is S[];
  }
): ComponentErrorById<Id> | undefined {
  const { validateStructure } = fns;

  if (!Array.isArray(data) || (validateStructure && !validateStructure(data))) {
    return { ownError: 'INVALID_TYPE' };
  }

  const result = data.map(fns.validateItem);

  if (result.some((item) => item !== undefined)) {
    return { items: result };
  }
}
