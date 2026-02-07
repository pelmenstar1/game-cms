import {
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ForeignComponentDataResolverContext,
} from '@game-cms/core';
import { defineComponentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

import { searchScoreComposer } from '../../internal/searchScoreComposer.js';
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
  search: (query, data, options, context) => {
    const optionsMap = options.options;

    const composer = searchScoreComposer();

    for (const { key, data: itemData } of data) {
      const { componentId, options: baseOptions } = optionsMap[key];

      composer.include(
        context.search(query, componentId, itemData, baseOptions)
      );
    }

    return composer.result();
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
    raw: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentDataResolverContext,
    args: ComponentDataResolverArgs
  ) => {
    return raw.map((item) => {
      const { componentId, options: baseOptions } = options.options[item.key];

      return context.resolveRawData(componentId, item.data, baseOptions, args);
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
