import { mapObject } from '@game-cms/shared/object';
import {
  ComponentClientDataById,
  ComponentClientDataResolver,
  ComponentDataOrError,
  ComponentOptionsById,
  ForeignComponentContext,
} from '@game-cms/types';

import { ComposeEntry } from './types.js';

type Id = 'base::compose';

export const clientResolver: ComponentClientDataResolver<Id> = {
  toClient: (data, options, context) =>
    mapObject(options, (prop, key) =>
      context.toClient(prop.componentId, data[key], prop.options)
    ),
  fromClient: <Args>(
    data: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentContext['clientResolver']
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
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
