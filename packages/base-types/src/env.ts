import '@game-cms/env';

import type { ApiErrorStatusMap } from './api.js';
import type { ServerEntitySchema } from './entity.js';

export interface OwnEnvironment {
  entitySchemas: ServerEntitySchema[];
}

declare module '@game-cms/env' {
  interface ApiEnvironment {
    statusCodes: ApiErrorStatusMap;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CmsEnvironment extends OwnEnvironment {}
}
