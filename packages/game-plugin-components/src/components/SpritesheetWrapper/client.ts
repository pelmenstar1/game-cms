import type { ComponentClientDataTransformer } from '@game-cms/core';

export const clientTransformer: ComponentClientDataTransformer<'game::spritesheet-wrapper'> =
  {
    getDefaultData: (options, context) => {
      return context.getDefaultData(options.componentId, options.baseOptions);
    },
    fromClient: (clientData, options, context) => {
      return context.fromClient(
        options.componentId,
        clientData,
        options.baseOptions
      );
    },
    toClient: (data, options, context) => {
      return context.toClient(options.componentId, data, options.baseOptions);
    },
  };
