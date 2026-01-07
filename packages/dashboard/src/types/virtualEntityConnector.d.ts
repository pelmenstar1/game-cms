declare module 'virtual:dashboard/entityConnector' {
  import type { EntityConnector } from '@game-cms/base-core';

  export const getEntitySchemas: EntityConnector['getEntitySchemas'];
  export const getEntitySchemaById: EntityConnector['getEntitySchemaById'];
}
