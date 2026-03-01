import {
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentOptionsById,
  ComponentOutDataById,
  ComponentResolvedDataById,
  defineComponentController,
  ForeignComponentDataResolverContext,
  searchScoreComposer,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { DataEntry } from './internal/types.js';

type Id = (typeof core)['id'];

export default defineComponentController({
  core,
  structure: ({ options }, context) => {
    return mapObject(options, (prop) =>
      context.getStructure(prop.componentId, prop.options)
    ) as ComponentDataStructure;
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
            { storage: itemData, searchIndex: searchIndex[i] as never },
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      const { options: optionsMap } = options;

      return data.map((item) => {
        const { key, data: itemData } = item;
        const { componentId, options: baseOptions } = optionsMap[key];

        return context.createSearchIndex(componentId, itemData, baseOptions);
      });
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
  },
});
