import { ResolvedCmsConfig } from '@game-cms/core';
import { MaybeAsyncFactory } from '@game-cms/shared';
import { RouteConfigEntry } from '@react-router/dev/routes';

export type CustomDashboardRouteLayout = 'default' | 'settings';

export interface CustomDashboardRoute extends RouteConfigEntry {
  layout?: CustomDashboardRouteLayout;
}

declare module './plugin.js' {
  interface PluginDashboardConfig {
    routes?: MaybeAsyncFactory<
      CustomDashboardRoute[],
      [config: ResolvedCmsConfig]
    >;
  }
}
