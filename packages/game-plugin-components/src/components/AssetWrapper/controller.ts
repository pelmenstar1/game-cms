/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { fromEntriesNullable } from '@game-cms/shared/object';

import core from './core.js';

export default defineComponentController({
  core,
  validator: (data, options, context, params) => {
    const { componentId, baseOptions } = options;
    const base = context.validate(componentId, data, baseOptions, params);

    if (base !== undefined) {
      return { base };
    }
  },
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  innerDependencies: (options, context) =>
    context.getDependencies(options.componentId, options.baseOptions),
  atomWalker: (data, options, apply, context) => {
    context.walk(options.componentId, data.base, options.baseOptions, apply);
  },
  migrate: (data, options, context) => {
    if (isNonNullObject(data)) {
      const { base } = data;

      if (base !== undefined) {
        const { componentId, baseOptions } = options;

        return {
          base: context.migrate(componentId, base, baseOptions),
          derived: {},
        };
      }
    }
  },
  resolver: (data, options, context, args) => {
    const { componentId, baseOptions } = options;

    return context.resolveOutData(componentId, data, baseOptions, args);
  },
  search: {
    getScore: (query, target, options, context) => {
      const { componentId, baseOptions } = options;

      return context.getScore(
        query,
        componentId,
        {
          storage: target.storage.base,
          searchIndex: target.searchIndex,
        },
        baseOptions
      );
    },
    createIndex: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return context.createSearchIndex(componentId, data.base, baseOptions);
    },
  },
  storageTransformer: {
    getDefaultData: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        base: context.getDefaultData(componentId, baseOptions),
        derived: {},
      };
    },
    fromStorage: async (data, options, context) => {
      const { componentId, baseOptions, pipeline } = options;

      const derivedEntries = await Promise.all(
        pipeline.map(async (step) => {
          const value = data.derived[step.id as keyof typeof data.derived];

          if (value) {
            return [step.id, await step.fromStorage(value, context)] as const;
          }
        })
      );

      return {
        base: await context.fromStorage(componentId, data.base, baseOptions),
        derived: fromEntriesNullable(derivedEntries),
      };
    },
    toStorage: async (data, options, context) => {
      const { componentId, baseOptions, pipeline } = options;

      const derivedEntries = await Promise.all(
        pipeline.map(async (step) => {
          const value = await step.apply(data, options, context);

          return [step.id, value] as const;
        })
      );

      return {
        base: await context.toStorage(componentId, data, baseOptions),
        derived: Object.fromEntries(derivedEntries),
      };
    },
    disposeData: async (data, options) => {
      const { derived } = data;
      const { pipeline } = options;

      await Promise.all(
        pipeline.map(async (step) => {
          const value = derived[step.id as keyof typeof derived];

          if (value) {
            await step.disposeStorage?.(value);
          }
        })
      );
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
