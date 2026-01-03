declare module 'virtual:dashboard/entityConnector' {
  import type { EntityConnector } from '@game-cms/base-types';

  export const getEntitySchemas: EntityConnector['getEntitySchemas'];
  export const getEntitySchemaById: EntityConnector['getEntitySchemaById'];
}
