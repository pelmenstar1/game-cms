import { mapObject } from '@game-cms/shared/object';
import { ComponentClientDataResolver } from '@game-cms/types';

import { ComposeError } from './types.js';

export const clientResolver: ComponentClientDataResolver<'base::compose'> = {
  toClient: (data, options, context) =>
    mapObject(options, (prop, key) =>
      context.toClient(prop.componentId, data[key], prop.options)
    ),
  fromClient: (data, options, context) => {
    const result = Object.entries(options).map(
      ([key, prop]) =>
        [
          key,
          context.fromClient(prop.componentId, data[key], prop.options),
        ] as const
    );

    const error = result.map(
      ([key, item]) => [key, (item as { error?: ComposeError }).error] as const
    );

    if (error.some(([, error]) => error !== undefined)) {
      return { error };
    }

    return {
      result: Object.fromEntries(
        result.map(([key, item]) => {
          if (!('result' in item)) {
            throw new Error('No result in item');
          }

          return [key, item.result] as const;
        })
      ),
    };
  },
};
