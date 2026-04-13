import { defineComponentClientController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import core from './core.js';

export default defineComponentClientController({
  core,
  getDefaultData: (options, context) => {
    return {
      base: context.getDefaultData(options.componentId, options.baseOptions),
    };
  },
  validator: (data, options, context, params) => {
    if (isNonNullObject(data) && 'base' in data) {
      const { base } = data;

      if (base !== undefined) {
        const { componentId, baseOptions } = options;
        const base = context.validate(
          componentId,
          data.base,
          baseOptions,
          params
        );

        if (base !== undefined) {
          return { base };
        }

        return;
      }
    }

    return { ownError: 'INVALID_TYPE' as const };
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
