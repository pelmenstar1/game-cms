import '@game-cms/global';

import { ApiErrorStatusMap } from '@game-cms/core/api';

import { EntityBackContext } from './entity/backContext.js';
import type { EntityId, EntitySchemaById } from './entity/core.js';

export interface EntityDescriptor<Id extends EntityId> {
  schema: {
    value: EntitySchemaById<Id>;

    /**
     * Path to the file where entity schema is defined. Might not be present, if entity is defined in-place in the registry, i.e. it's not re-exported.
     */
    filePath?: string;
  };

  backContext: EntityBackContext;
}

export type EntityDescriptorMap = {
  [Id in EntityId]: EntityDescriptor<Id>;
};

export type EntityEnvConfig = {
  registryFilePath: string;
  registry: EntityDescriptorMap;
};

export interface OwnEnvironment {
  entity: EntityEnvConfig;
}

declare module '@game-cms/global' {
  interface ApiEnvironment {
    statusCodes: ApiErrorStatusMap;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CmsEnvironment extends OwnEnvironment {}
}
