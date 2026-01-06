import {
  ComponentDataResolverArgs,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ForeignComponentDataResolverContext,
} from '@game-cms/core';
import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

type Id = (typeof meta)['id'];

function invalidPath(message: string): never {
  throw new Error(`Invalid path: ${message}`);
}

export default component({
  meta,
  validator,
  defaultRawData,
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
            suffix as unknown as null,
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
