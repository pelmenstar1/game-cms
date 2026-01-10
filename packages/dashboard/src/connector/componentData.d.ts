declare module 'virtual:dashboard/componentConnectorData' {
  import type {
    ComponentClientDataTransformer,
    ComponentClientModule,
    ComponentCore,
    ComponentId,
  } from '@game-cms/core';

  const _default: {
    [Id in ComponentId]: {
      renderer: () => Promise<ComponentClientModule<Id>>;
      core: ComponentCore<Id>;
      client?: {
        clientTransformer: ComponentClientDataTransformer<Id>;
      };
    };
  };

  export default _default;
}
