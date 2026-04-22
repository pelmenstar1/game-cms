import {
  ComponentClientOptionsById,
  ComponentDataValidatorParams,
  ComponentOptionsById,
  defineComponentController,
  ForeignComponentClientOptionsTransformerContext,
  ForeignComponentValidationContext,
  searchScoreComposer,
} from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { ComposeOptionsEntry } from './types.js';
import { validator } from './validator.js';

type Id = (typeof core)['id'];

export default defineComponentController({
  core,
  validator: <Args>(
    data: unknown,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentValidationContext,
    params?: ComponentDataValidatorParams
  ) => {
    return validator<Args>(
      data,
      Object.keys(options),
      params,
      (key, propValue) => {
        const { componentId, options: baseOptions } = options[key];

        return context.validate(componentId, propValue, baseOptions, params);
      }
    );
  },
  structure: (options, context) => {
    return mapObject(options, (prop) =>
      context.getStructure(prop.componentId, prop.options)
    );
  },
  innerDependencies: (options, context) => {
    return Object.values<ComposeOptionsEntry>(options).flatMap((prop) =>
      context.getDependencies(prop.componentId, prop.options)
    );
  },
  atomWalker: (data, options, apply, context) => {
    for (const entry of Object.entries(options)) {
      const key = entry[0];
      const { componentId, options: baseOptions } =
        entry[1] as ComposeOptionsEntry;

      context.walk(componentId, data[key], baseOptions, apply);
    }
  },
  migrate: (data, options, context) => {
    if (isNonNullObject(data)) {
      return mapObject(options, ({ componentId, options }, key) =>
        context.migrate(componentId, data[key], options)
      );
    }
  },
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: baseOptions } = options[key];

      return context.resolveOutData(componentId, value, baseOptions, args);
    });
  },
  search: {
    getScore: (query, target, options, context) => {
      const { searchIndex, storage } = target;
      const composer = searchScoreComposer();

      for (const key in options) {
        const { componentId, options: baseOptions } = options[key];
        const value = storage[key];

        composer.include(
          context.getScore(
            query,
            componentId,
            {
              storage: value,
              searchIndex: searchIndex[key],
            } as never,
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      return asyncMapObject(options, (schema, key) => {
        const { componentId, options: baseOptions } = schema;

        return context.createSearchIndex(
          componentId,
          data[key] as never,
          baseOptions
        );
      });
    },
  },
  mergeData: async (target, source, options, context) => {
    const sourceMerged = await asyncMapObject(source, (item, key) => {
      const { componentId, options: baseOptions } = options[key];

      return context.merge(
        componentId,
        target[key] as never,
        item as never,
        baseOptions
      );
    });

    return { ...target, ...sourceMerged };
  },
  storageTransformer: {
    getDefaultData: (options, context) => {
      return mapObject(options, (item) =>
        context.getDefaultData(item.componentId, item.options)
      );
    },
    fromStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.fromStorage(componentId, item as never, baseOptions);
      });
    },
    toStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.toStorage(componentId, item as never, baseOptions);
      });
    },
    disposeData: async (data, options, context) => {
      await Promise.all(
        Object.entries(options).map(([key, { componentId, options }]) =>
          context.disposeData(componentId, data[key], options)
        )
      );
    },
  },
  clientOptionsTransformer: {
    toClient: <Args>(
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentClientOptionsTransformerContext
    ) => {
      return mapObject(options, (item) => {
        return {
          componentId: item.componentId,
          options: context.toClient(item.componentId, item.options),
        };
      }) as ComponentClientOptionsById<Id, Args>;
    },
  },
});
