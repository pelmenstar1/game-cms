declare module 'virtual:dashboard/entityCheckConnectorData' {
  import {
    EntityCheckClientController,
    EntityCheckClientOptions,
    EntityCheckId,
  } from '@game-cms/base-core';

  const _default: {
    [Id in EntityCheckId]?: {
      options?: EntityCheckClientOptions<Id>;
      controller?: () => Promise<{
        default: EntityCheckClientController<Id>;
      }>;
    };
  };

  export default _default;
}
