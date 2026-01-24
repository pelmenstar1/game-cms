import {
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ForeignComponentDataResolverContext,
} from '@game-cms/core';
import { componentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { DataEntry } from './internal/types.js';

type Id = (typeof core)['id'];

function invalidPath(message: string): never {
  throw new Error(`Invalid path: ${message}`);
}

export default componentController({
  core,
  structure: ({ options }, context) => {
    return mapObject(options, (prop) =>
      context.getStructure(prop.componentId, prop.options)
    ) as ComponentDataStructure;
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
  pathWalker: (data, { options }, path, apply, context) => {
    if (!path.startsWith('[')) {
      invalidPath('expected [');
    }

    const endBracketIndex = path.indexOf(']', 1);
    if (endBracketIndex === -1) {
      invalidPath('expected ]');
    }

    const zoneName = path.slice(1, endBracketIndex);

    const { componentId, options: baseOptions } = options[zoneName];

    if (path[endBracketIndex + 1] === '.') {
      const suffix = path.slice(endBracketIndex + 2);

      for (const item of data) {
        if (item.key === zoneName) {
          context.applyAtPath(
            componentId,
            item.data,
            baseOptions,
            suffix,
            apply
          );
        }
      }
    } else {
      for (const item of data) {
        if (item.key === zoneName) {
          apply(item.data);
        }
      }
    }
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
