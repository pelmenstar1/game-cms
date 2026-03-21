import '@game-cms/global';

import { ApiErrorStatusMap } from '@game-cms/core/api';

import type { EntityId, EntitySchemaById } from './entity/core.js';

export interface EntityDescriptor<Id extends EntityId> {
  schema: EntitySchemaById<Id>;
}

export type EntityDescriptorMap = {
  [Id in EntityId]: EntityDescriptor<Id>;
};

export type EntityEnvConfig = {
  schemaRegistry: {
    filePath: string;
    items: EntityDescriptorMap;
  };
  clientContextRegistry?: {
    filePath: string;
  };
};

export interface OwnEnvironment {
  entity: EntityEnvConfig;
}

declare module '@game-cms/global' {
  interface ApiEnvironment {
    statusCodes: ApiErrorStatusMap;
  }

  interface CmsEnvironment extends OwnEnvironment {}
}
