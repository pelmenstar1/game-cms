import {
  ComponentDataValidatorParams,
  ComponentErrorById,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { Id } from './types.js';

export function validator<Args>(
  data: unknown,
  keys: string[],
  params: ComponentDataValidatorParams | undefined,
  validate: (key: string, propValue: unknown) => unknown
): ComponentErrorById<Id, Args> | undefined {
  if (!isNonNullObject(data)) {
    return { ownError: 'INVALID_TYPE' };
  }

  const properties: Record<string, unknown> = {};
  let anyError = false;

  for (const key of keys) {
    const propValue = data[key];
    if (propValue === undefined && params?.partial) {
      continue;
    }

    const validationResult = validate(key, propValue);
    if (validationResult !== undefined) {
      anyError = true;
      properties[key] = validationResult;
    }
  }

  if (anyError) {
    return { properties } as ComponentErrorById<Id, Args>;
  }
}
