import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(data, (element) =>
      context.validate(componentId, element, baseOptions)
    );
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
