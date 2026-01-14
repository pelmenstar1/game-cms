import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { componentController } from '@game-cms/core';

import core from './core.js';

export default componentController({
  core,
  resolver: (raw, options, context, args) => {
    const result = resolveConditionalData(raw, args as ConditionalValueInput);

    return context.resolveRawData(
      options.componentId,
      result,
      options.baseOptions,
      args
    );
  },
  pathWalker: (data, options, path, apply, context) => {
    const { baseOptions, componentId } = options;

    context.applyAtPath(componentId, data.default, baseOptions, path, apply);

    for (const item of data.alternative) {
      context.applyAtPath(componentId, item.value, baseOptions, path, apply);
    }
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
