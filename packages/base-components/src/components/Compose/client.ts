import {
  ComponentClientOptionsById,
  ComponentDataValidatorParams,
  defineComponentClientController,
  ForeignComponentClientValidationContext,
} from '@game-cms/core';
import { mapObject } from '@game-cms/shared/object';

import core from './core.js';
import { Id } from './types.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  validator: <Args>(
    data: unknown,
    options: ComponentClientOptionsById<Id, Args>,
    context: ForeignComponentClientValidationContext,
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
  getDefaultData: (options, context) =>
    mapObject(options, (item) =>
      context.getDefaultData(item.componentId, item.options)
    ),
  transformer: {
    toClient: (data, options, context) => {
      return mapObject(options, (prop, key) =>
        context.toClient(prop.componentId, data[key], prop.options)
      );
    },
    fromClient: (data, options, context) => {
      return mapObject(options, (prop, key) =>
        context.fromClient(prop.componentId, data[key], prop.options)
      );
    },
  },
});
