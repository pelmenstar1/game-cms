import { defineComponentCore } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { OwnError } from './types.js';

function invalidPath(message: string): never {
  throw new Error(`Invalid path: ${message}`);
}

export default defineComponentCore({
  id: 'base::dynamic-zone',
  defaultOutData: () => [],
  validator: (data, { minItems, maxItems, options }, context) => {
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
  pathWalker: (data, { options }, path, apply, context) => {
    if (!path.startsWith('[')) {
      invalidPath('expected [');
    }

    const endBracketIndex = path.indexOf(']', 1);
    if (endBracketIndex === -1) {
      invalidPath('expected ]');
    }

    const zoneName = path.slice(1, endBracketIndex);

    const { componentId, options: baseOptions } = options[zoneName];
    const suffix =
      path[endBracketIndex + 1] === '.'
        ? path.slice(endBracketIndex + 2)
        : undefined;

    for (const item of data) {
      const { key, data } = item;

      if (key === zoneName) {
        if (suffix !== undefined) {
          context.applyAtPath(componentId, data, baseOptions, suffix, apply);
        } else {
          apply(data);
        }
      }
    }
  },
});
