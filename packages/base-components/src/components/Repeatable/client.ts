import { defineComponentClientController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator<{ data: unknown }>(data, {
      validateItem: (element) => {
        return context.validate(componentId, element.data, baseOptions);
      },
      validateStructure: (data) => {
        return data.every(
          (item): item is { data: unknown } =>
            isNonNullObject(item) && 'data' in item
        );
      },
    });
  },
  getDefaultData: () => [],
  transformer: {
    toClient: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return data.map((item) => ({
        clientKey: context.idSource(),
        data: context.toClient(componentId, item, baseOptions),
      }));
    },
    fromClient: (clientData, options, context) => {
      const { componentId, baseOptions } = options;

      return clientData.map((item) =>
        context.fromClient(componentId, item.data, baseOptions)
      );
    },
  },
});
