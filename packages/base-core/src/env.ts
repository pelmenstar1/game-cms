import '@game-cms/global';

import { ApiErrorStatusMap } from '@game-cms/core/api';

import type { EntityId, EntitySchemaById } from './entity/core.js';

export interface EntityDescriptor<
  Id extends EntityId,
> extends EntitySchemaById<Id> {
  /**
   * Path to the file where entity is defined. Might not be present, if entity is defined in-place in the registry, i.e. it's not re-exported.
   */
  filePath?: string;
}

export type EntityEnvConfig = {
  registryFilePath: string;
  registry: {
    [K in EntityId]: EntityDescriptor<K>;
  };
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
