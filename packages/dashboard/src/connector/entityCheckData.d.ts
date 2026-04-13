declare module 'virtual:dashboard/entityCheckConnectorData' {
  import {
    EntityCheckClientController,
    EntityCheckId,
  } from '@game-cms/base-core';

  const _default: {
    [Id in EntityCheckId]?: () => Promise<{
      default: EntityCheckClientController<Id>;
    }>;
  };

  export default _default;
}
