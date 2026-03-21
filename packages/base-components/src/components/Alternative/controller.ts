import {
  ConditionalValueInput,
  resolveConditionalData,
} from '@game-cms/conditional';
import { unknownConditionalData } from '@game-cms/conditional/schema';
import { defineComponentController, searchScoreComposer } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  atomWalker: (data, options, apply, context) => {
    const { componentId, baseOptions } = options;

    context.walk(componentId, data.default, baseOptions, apply);

    for (const choice of data.alternative) {
      context.walk(componentId, choice.value, baseOptions, apply);
    }
  },
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
  search: {
    getScore: (query, target, options, context) => {
      const {
        storage: { alternative, default: defaultStorage },
        searchIndex,
      } = target;

      const { componentId, baseOptions } = options;

      const composer = searchScoreComposer();

      composer.include(
        context.getScore(
          query,
          componentId,
          {
            storage: defaultStorage,
            searchIndex: searchIndex.default,
          },
          baseOptions
        )
      );

      for (let i = 0; i < alternative.length; i++) {
        composer.include(
          context.getScore(
            query,
            componentId,
            {
              storage: alternative[i].value,
              searchIndex: searchIndex.alternative[i],
            },
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        default: context.createSearchIndex(
          componentId,
          data.default,
          baseOptions
        ),
        alternative: data.alternative.map((choice) =>
          context.createSearchIndex(componentId, choice.value, baseOptions)
        ),
      };
    },
  },
  resolver: (input, options, context, args) => {
    const result = resolveConditionalData(input, args as ConditionalValueInput);

    return context.resolveOutData(
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
  clientOptionsTransformer: {
    toClient: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        componentId,
        baseOptions: context.toClient(componentId, baseOptions),
      };
    },
  },
});
