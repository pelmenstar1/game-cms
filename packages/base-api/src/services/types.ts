import { FromEntries } from '@game-cms/shared';

type ServiceExport = typeof import('./index.js');

type BaseServicesMap = FromEntries<
  {
    [K in keyof ServiceExport]: [ServiceExport[K]['id'], ServiceExport[K]];
  }[keyof ServiceExport]
>;

declare module '@game-cms/core' {
  interface ServiceMap extends BaseServicesMap {}
}
