import {
  ComponentBackContext,
  defineComponentController,
} from '@game-cms/core';
import { filterOutNullable } from '@game-cms/shared/collections';

import core from './core.js';

function getPipeline(
  context: { backContext: ComponentBackContext },
  pipelineId: string
) {
  const result = context.backContext.assetPipelines?.[pipelineId];

  if (!result) {
    throw new Error(`Pipeline with id ${pipelineId} not found in context`);
  }

  return result;
}

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  atomWalker: (data, options, apply, context) => {
    context.walk(options.componentId, data.base, options.baseOptions, apply);
  },
  migrate: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return {
      base: context.migrate(componentId, data, baseOptions),
      derived: {},
    };
  },
  resolver: (data, options, context, args) => {
    const { componentId, baseOptions } = options;

    return context.resolveOutData(componentId, data, baseOptions, args);
  },
  mergeData: async (target, source, options, context) => {
    const mergedBase = await context.merge(
      options.componentId,
      target.base,
      source,
      options.baseOptions
    );

    return {
      base: mergedBase,
      derived: target.derived,
    };
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
      const { componentId, baseOptions } = options;

      const pipeline = getPipeline(context, options.pipelineId);
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
        derived: Object.fromEntries(filterOutNullable(derivedEntries)),
      };
    },
    toStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      const pipeline = getPipeline(context, options.pipelineId);
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
  },
});
