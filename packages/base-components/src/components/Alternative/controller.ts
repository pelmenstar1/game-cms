import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { unknownConditionalData } from '@game-cms/conditional/schema';
import { defineComponentController } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
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
  search: (query, data, options, context) => {
    const { componentId, baseOptions } = options;

    let result = context.search(query, componentId, data.default, baseOptions);

    for (const { value } of data.alternative) {
      result = Math.max(
        result,
        context.search(query, componentId, value, baseOptions)
      );
    }

    return result;
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
