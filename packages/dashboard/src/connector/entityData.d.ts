declare module 'virtual:dashboard/entityConnectorData' {
  import type { EntityId, EntitySchemaById } from '@game-cms/base-core';

  const _default: { [K in EntityId]: EntitySchemaById<K> };

  export default _default;
}
