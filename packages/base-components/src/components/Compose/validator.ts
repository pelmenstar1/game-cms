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

  const entries = keys.map((key) => {
    const propValue = data[key];
    if (propValue === undefined && params?.partial) {
      return [key, undefined] as const;
    }

    return [key, validate(key, propValue)] as const;
  });

  if (entries.some(([, value]) => value !== undefined)) {
    return { properties: Object.fromEntries(entries) as never };
  }
}
