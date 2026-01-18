import type { ComponentClientDataTransformer } from '@game-cms/core';

export const clientTransformer: ComponentClientDataTransformer<'game::spritesheet-wrapper'> =
  {
    getDefaultData: (options, context) => {
      return {
        base: context.getDefaultData(options.componentId, options.baseOptions),
      };
    },
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
        spritesheets: data.spritesheets,
      };
    },
  };
