declare module 'virtual:dashboard/componentConnectorData' {
  import type {
    ComponentClientDataTransformer,
    ComponentClientModule,
    ComponentDataValidator,
    ComponentDefaultDataHandler,
    ComponentId,
    ComponentMeta,
  } from '@game-cms/core';

  const _default: {
    [Id in ComponentId]: {
      renderer: () => Promise<ComponentClientModule<Id>>;
      shared: {
        meta: ComponentMeta<Id>;
        defaultRawData: ComponentDefaultDataHandler<Id>;
        validator: ComponentDataValidator<Id>;
      };
      client?: {
        clientTransformer: ComponentClientDataTransformer<Id>;
      };
    };
  };

  export default _default;
}
