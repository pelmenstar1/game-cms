import {
  componentCore,
  ComponentOptionsById,
  ForeignComponentValidationContext,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { OwnError } from './types.js';

const id = 'base::dynamic-zone';

type Id = typeof id;

export default componentCore({
  id,
  defaultRawData: () => [],
  validator: <Args>(
    data: unknown,
    { minItems, maxItems, options }: ComponentOptionsById<Id, Args>,
    context: ForeignComponentValidationContext
  ) => {
    if (
      !Array.isArray(data) ||
      !data.every(
        (item): item is { key: string; data: unknown } =>
          isNonNullObject(item) && 'key' in item && 'data' in item
      )
    ) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const items = data.map((dataItem) => {
      const { componentId, options: baseOptions } = options[dataItem.key];

      return context.validate(componentId, dataItem.data, baseOptions);
    });

    let ownError: OwnError | undefined;

    if (minItems !== undefined && items.length < minItems) {
      ownError = 'TOO_FEW_ITEMS';
    } else if (maxItems !== undefined && items.length > maxItems) {
      ownError = 'TOO_MANY_ITEMS';
    }

    if (
      ownError !== undefined ||
      items.some((element) => element !== undefined)
    ) {
      return { ownError, items };
    }
  },
});
