import {
  ComponentClientDataById,
  ComponentClientDataTransformer,
  ComponentClientOptionsById,
  ComponentInDataOrError,
  ComponentOutDataById,
  ForeignComponentClientDataTransformerContext,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import { ComposeEntry } from './types.js';

type Id = 'base::compose';

export const clientTransformer: ComponentClientDataTransformer<Id> = {
  ownValidation: true,
  getDefaultData: (options, context) =>
    mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    ),
  toClient: <Args>(
    data: ComponentOutDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => {
    return mapObject(options, (prop, key) =>
      context.toClient(prop.componentId, data[key], prop.options)
    );
  },
  fromClient: <Args>(
    data: ComponentClientDataById<Id, Args>,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientDataTransformerContext
  ) => {
    type Options = ComposeEntry<Args>['clientOptions'];
    type OptionsEntry = Options[keyof Options];

    const result = Object.entries<OptionsEntry>(options).map(([key, prop]) => {
      const { componentId, options } = prop;

      const client = context.fromClient(componentId, data[key], options);

      return {
        key,
        client,
        coreError: context.validation.validate(
          componentId,
          client.result,
          options
        ),
      };
    });

    const error = result.map(
      ({ key, client, coreError }) => [key, client.error ?? coreError] as const
    );

    const resultOrError = error.some(([, error]) => error !== undefined)
      ? { error: { properties: Object.fromEntries(error) } }
      : {
          result: Object.fromEntries(
            result.map(({ key, client }) => [key, client.result] as const)
          ),
        };

    return resultOrError as ComponentInDataOrError<Id, Args>;
  },
};
