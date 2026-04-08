import { ComponentOptionsById } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { Id, OwnError } from './types.js';

function isDataItem(item: unknown): item is { key: string; data: unknown } {
  return isNonNullObject(item) && 'key' in item && 'data' in item;
}

export function validator(
  data: unknown,
  validate: (key: string, itemData: unknown) => unknown,
  options: ComponentOptionsById<Id>
) {
  if (!Array.isArray(data) || !data.every(isDataItem)) {
    return { ownError: 'INVALID_TYPE' as const };
  }

  const items = data.map((item) => validate(item.key, item.data));

  let ownError: OwnError | undefined;

  const { minItems, maxItems } = options;

  if (minItems !== undefined && data.length < minItems) {
    ownError = 'TOO_FEW_ITEMS';
  } else if (maxItems !== undefined && data.length > maxItems) {
    ownError = 'TOO_MANY_ITEMS';
  }

  if (
    ownError !== undefined ||
    items.some((element) => element !== undefined)
  ) {
    return { ownError, items };
  }
}
