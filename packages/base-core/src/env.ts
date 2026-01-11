import '@game-cms/global';

import type { ApiErrorStatusMap } from './api.js';
import type { EntitySchema } from './entity.js';

export interface EntityDescriptor extends EntitySchema {
  filePath: string;
}

export interface OwnEnvironment {
  entities: EntityDescriptor[];
}

declare module '@game-cms/global' {
  interface ApiEnvironment {
    statusCodes: ApiErrorStatusMap;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CmsEnvironment extends OwnEnvironment {}
}
