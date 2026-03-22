import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';

export default defineComponentClientController({
  core,
  getDefaultData: (options, context) => {
    return {
      base: context.getDefaultData(options.componentId, options.baseOptions),
    };
  },
  validator: (data, options, context, params) => {
    return context.validate(
      options.componentId,
      data,
      options.baseOptions,
      params
    );
  },
  transformer: {
    fromClient: (clientData, options, context) => {
      return context.fromClient(
        options.componentId,
        clientData.base,
        options.baseOptions
      );
    },
    toClient: (data, options, context) => {
      return {
        base: context.toClient(
          options.componentId,
          data.base,
          options.baseOptions
        ),
        derived: data.derived,
      };
    },
  },
});
