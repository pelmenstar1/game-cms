import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { unknownConditionalData } from '@game-cms/conditional/schema';
import { componentController } from '@game-cms/core';

import core from './core.js';

export default componentController({
  core,
  migrate: (data, options, context) => {
    const result = unknownConditionalData.safeParse(data);

    if (result.success) {
      const { componentId, baseOptions } = options;

      return {
        default: context.migrate(componentId, result.data.default, baseOptions),
        alternative: result.data.alternative.map((choice) => ({
          condition: choice.condition,
          value: context.migrate(componentId, choice.value, baseOptions),
        })),
      };
    }
  },
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
    getDefaultData: (options, context) => ({
      default: context.getDefaultData(options.componentId, options.baseOptions),
      alternative: [],
    }),
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
