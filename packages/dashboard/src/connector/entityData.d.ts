declare module 'virtual:dashboard/entityConnectorData' {
  import type { EntityId, EntitySchemaById } from '@game-cms/base-core';

  export const fullEntityMap: {
    [K in EntityId]: () => Promise<{ default: EntitySchemaById<K> }>;
  };
  export const metaMap: Record<EntityId, { title: string }>;
}
