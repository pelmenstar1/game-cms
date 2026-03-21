declare module 'virtual:dashboard/entityConnectorData' {
  import type { EntityClientContextMap, EntityId } from '@game-cms/base-core';

  export const getClientContextRegistry: () => Promise<
    Partial<EntityClientContextMap>
  >;

  export const entityMetaMap: Record<EntityId, { title: string }>;
}
