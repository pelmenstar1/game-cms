import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  defaultRawData,
  validator,
  resolver: (raw, _options, _context, args) => {
    return resolveConditionalData(raw, args as ConditionalValueInput);
  },
  storageTransformer: {
    fromStorage: async (data, options, context) => {
      const { baseOptions, componentId } = options;

      return {
        default: await context.fromStorage(
          componentId,
          data.default,
          baseOptions
        ),
        alternative: await Promise.all(
          data.alternative.map(async (item) => ({
            condition: item.condition,
            value: await context.fromStorage(
              componentId,
              item.value,
              baseOptions
            ),
          }))
        ),
      };
    },
    toStorage: async (data, options, context) => {
      const { baseOptions, componentId } = options;

      return {
        default: await context.toStorage(
          componentId,
          data.default,
          baseOptions
        ),
        alternative: await Promise.all(
          data.alternative.map(async (item) => ({
            condition: item.condition,
            value: await context.toStorage(
              componentId,
              item.value,
              baseOptions
            ),
          }))
        ),
      };
    },
  },
});
