import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentClientController({
  core,
  validator: (data, options, context) => {
    return validator(
      data,
      (key, itemData) => {
        const { componentId, options: baseOptions } = options.options[key];

        return context.validate(componentId, itemData, baseOptions);
      },
      options
    );
  },
  getDefaultData: () => [],
  transformer: {
    toClient: (data, options, context) => {
      return data.map((dataItem) => {
        const { componentId, options: baseOptions } =
          options.options[dataItem.key];

        return {
          clientKey: context.idSource(),
          key: dataItem.key,
          data: context.toClient(componentId, dataItem.data, baseOptions),
        };
      });
    },
    fromClient: (clientData, options, context) => {
      return clientData.map((value) => {
        const { key, data } = value;
        const { componentId, options: baseOptions } = options.options[key];

        return {
          key,
          data: context.fromClient(componentId, data, baseOptions),
        };
      });
    },
  },
});
