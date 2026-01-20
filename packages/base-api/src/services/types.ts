import type { ApiToken, StorageItem, User } from '@game-cms/base-core';
import type { FromEntries } from '@game-cms/core';

type ServiceExport = typeof import('./index.js');

type BaseServicesMap = FromEntries<
  {
    [K in keyof ServiceExport]: [ServiceExport[K]['id'], ServiceExport[K]];
  }[keyof ServiceExport]
>;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ServiceMap extends BaseServicesMap {}
}

declare module '@game-cms/base-core' {
  interface DatabaseEntityMap {
    'base::users': User;
    'base::apiTokens': ApiToken;
    'base::storage': StorageItem;
  }
}
