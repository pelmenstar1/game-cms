declare module 'virtual:dashboard/componentConnectorData' {
  import type {
    ComponentClientController,
    ComponentId,
    ComponentRendererModule,
  } from '@game-cms/core';

  const _default: {
    [Id in ComponentId]: {
      renderer: () => Promise<ComponentRendererModule<Id>>;
      client: ComponentClientController<Id>;
    };
  };

  export default _default;
}
