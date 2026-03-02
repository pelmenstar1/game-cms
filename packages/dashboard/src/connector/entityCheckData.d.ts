declare module 'virtual:dashboard/entityCheckConnectorData' {
  import { EntityCheckId, EntityCheckRenderer } from '@game-cms/base-core';

  const _default: {
    [Id in EntityCheckId]?: () => Promise<{ default: EntityCheckRenderer<Id> }>;
  };

  export default _default;
}
