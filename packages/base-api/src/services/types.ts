import type { ApiToken, ServerUser, StorageItem } from '@game-cms/base-types';
import type { FromEntries } from '@game-cms/types';

type ServiceExport = typeof import('./index.js');

type BaseServicesMap = FromEntries<
  {
    [K in keyof ServiceExport]: [ServiceExport[K]['id'], ServiceExport[K]];
  }[keyof ServiceExport]
>;

declare module '@game-cms/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ServiceMap extends BaseServicesMap {}
}

declare module '@game-cms/base-types' {
  interface DatabaseEntityMap {
    'base::users': ServerUser;
    'base::apiTokens': ApiToken;
    'base::storage': StorageItem;
  }
}
