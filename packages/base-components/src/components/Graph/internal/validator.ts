import { ComponentErrorById } from '@game-cms/core';

import { Id } from '../types.js';
import { dataShape } from './schema.js';

export function validator<Args>(
  rawData: unknown,
  validate: (nodeValue: unknown) => unknown
): ComponentErrorById<Id, Args> | undefined {
  const parseResult = dataShape.safeParse(rawData);
  if (!parseResult.success) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const { data } = parseResult;
  const base: Record<string, unknown> = {};

  let anyError = false;

  for (const [key, node] of Object.entries(data.nodes)) {
    const validationResult = validate(node.value);

    if (validationResult !== undefined) {
      anyError = true;
      base[key] = validationResult;
    }
  }

  if (anyError) {
    return { base };
  }
}
