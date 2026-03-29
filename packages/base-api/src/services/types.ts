import { FromEntries } from '@game-cms/shared';

type ServiceExport = typeof import('./index.js');

type BaseServicesMap = FromEntries<
  {
    [K in keyof ServiceExport]: [K, ServiceExport[K]];
  }[keyof ServiceExport]
>;

declare module '@game-cms/core' {
  interface ServiceTypeMeta {
    id: keyof ServiceExport;
  }

  interface ServiceTypeMap extends BaseServicesMap {}
}
