import {
  ComponentClientOptionsById,
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentResolvedDataById,
  defineComponentController,
  ForeignComponentClientOptionsTransformerContext,
  ForeignComponentDataResolverContext,
  searchScoreComposer,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { DataEntry } from './internal/types.js';
import { Id } from './types.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator: (data, options, context) => {
    const { options: optionsMap } = options;

    return validator(
      data,
      (key, itemData) => {
        const { componentId, options: baseOptions } = optionsMap[key];

        return context.validate(componentId, itemData, baseOptions);
      },
      options
    );
  },
  structure: ({ options }, context) => {
    return mapObject(options, (prop) =>
      context.getStructure(prop.componentId, prop.options)
    ) as ComponentDataStructure;
  },
  innerDependencies: (options, context) => {
    return Object.values(options.options).flatMap(
      ({ componentId, options: baseOptions }) =>
        context.getDependencies(componentId, baseOptions)
    );
  },
  atomWalker: (data, options, apply, context) => {
    const { options: optionsMap } = options;

    for (const item of data) {
      const { componentId, options: baseOptions } = optionsMap[item.key];

      context.walk(componentId, item.data, baseOptions, apply);
    }
  },
  search: {
    getScore: (query, target, options, context) => {
      const { storage, searchIndex } = target;
      const optionsMap = options.options;

      const composer = searchScoreComposer();

      for (let i = 0; i < storage.length; i++) {
        const { key, data: itemData } = storage[i];
        const { componentId, options: baseOptions } = optionsMap[key];

        composer.include(
          context.getScore(
            query,
            componentId,
            { storage: itemData, searchIndex: searchIndex[i] },
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      const { options: optionsMap } = options;

      return Promise.all(
        data.map((item) => {
          const { key, data: itemData } = item;
          const { componentId, options: baseOptions } = optionsMap[key];

          return context.createSearchIndex(componentId, itemData, baseOptions);
        })
      );
    },
  },
  migrate: (data, options, context) => {
    if (Array.isArray(data)) {
      const result: DataEntry<unknown, string>[] = [];

      for (const item of data) {
        if (isNonNullObject(item)) {
          const { key, data } = item as { key?: unknown; data?: unknown };

          if (typeof key === 'string') {
            const { componentId, options: baseOptions } = options.options[key];
            result.push({
              key,
              data: context.migrate(componentId, data, baseOptions),
            });
          }
        }
      }

      return result;
    }
  },
  resolver: <Args>(
    input: ComponentOutDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentDataResolverContext,
    args: ComponentDataResolverArgs
  ) => {
    return input.map((item) => {
      const { componentId, options: baseOptions } = options.options[item.key];

      return context.resolveOutData(componentId, item.data, baseOptions, args);
    }) as ComponentResolvedDataById<Id, Args>;
  },
  storageTransformer: {
    getDefaultData: () => [],
    fromStorage: (data, options, context) => {
      const { options: optionsMap } = options;

      return Promise.all(
        data.map(async (item) => {
          const { componentId, options: baseOptions } = optionsMap[item.key];

          return {
            key: item.key,
            data: await context.fromStorage(
              componentId,
              item.data,
              baseOptions
            ),
          };
        })
      );
    },
    toStorage: (data, options, context) => {
      const { options: optionsMap } = options;

      return Promise.all(
        data.map(async (item) => {
          const { componentId, options: baseOptions } = optionsMap[item.key];

          return {
            key: item.key,
            data: await context.toStorage(componentId, item.data, baseOptions),
          };
        })
      );
    },
    disposeData: async (data, options, context) => {
      const { options: optionsMap } = options;

      await Promise.all(
        data.map((item) => {
          const { componentId, options: baseOptions } = optionsMap[item.key];

          return context.disposeData(componentId, item.data, baseOptions);
        })
      );
    },
  },
  clientOptionsTransformer: {
    toClient: <Args>(
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentClientOptionsTransformerContext
    ) => {
      const { options: optionsMap } = options;

      return {
        minItems: options.minItems,
        maxItems: options.maxItems,
        options: mapObject(optionsMap, (item) => {
          return {
            ...item,
            options: context.toClient(item.componentId, item.options),
          };
        }),
      } as ComponentClientOptionsById<Id, Args>;
    },
  },
});
