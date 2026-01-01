import { mapObject } from '@game-cms/shared/object';
import {
  ComponentClientDataById,
  ComponentClientDataResolver,
  ComponentDataOrError,
  ComponentOptionsById,
  ComponentRawDataById,
  ForeignComponentClientDataResolverContext,
} from '@game-cms/types';

import { ComposeEntry } from './types.js';

type Id = 'base::compose';

export const clientResolver: ComponentClientDataResolver<Id> = {
  getDefaultData: (options, context) =>
    mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    ),
  toClient: async <Args>(
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => {
    type Options = ComposeEntry<Args>['options'];
    type OptionsEntry = Options[keyof Options];

    const entries = await Promise.all(
      Object.entries<OptionsEntry>(options).map(
        async ([key, prop]) =>
          [
            key,
            await context.toClient(prop.componentId, data[key], prop.options),
          ] as const
      )
    );

    return Object.fromEntries(entries) as ComponentRawDataById<Id, Args>;
  },
  fromClient: <Args>(
    data: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => {
    type Options = ComposeEntry<Args>['options'];
    type OptionsEntry = Options[keyof Options];

    const result = Object.entries<OptionsEntry>(options).map(([key, prop]) => {
      const { componentId, options } = prop;

      return [
        key,
        context.fromClient(
          componentId,
          // TODO: Fix any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
          data[key] as any,
          options
        ),
      ] as const;
    });

    const error = result.map(([key, item]) => [key, item.error] as const);

    const resultOrError = error.some(([, error]) => error !== undefined)
      ? { error: Object.fromEntries(error) }
      : {
          result: Object.fromEntries(
            result.map(([key, item]) => [key, item.result] as const)
          ),
        };

    return resultOrError as ComponentDataOrError<Id, Args>;
  },
};
