declare module 'virtual:dashboard/entityConnectorData' {
  import type {
    EntityId,
    EntitySchemaById,
    EntitySchemaRegistry,
  } from '@game-cms/base-core';
  import { DefaultExport } from '@game-cms/shared';

  export const registryImport: () => Promise<EntitySchemaRegistry>;

  export const entityMap: {
    [K in EntityId]: {
      title: string;
      schema?: () => Promise<DefaultExport<EntitySchemaById<K>>>;
    };
  };
}
