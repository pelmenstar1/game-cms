import { ResolvedCmsConfig } from '@game-cms/core';
import { MaybeAsyncFactory } from '@game-cms/shared';
import { RouteConfigEntry } from '@react-router/dev/routes';
import { Plugin as VitePlugin } from 'vite';

export interface CustomDashboardRoute extends RouteConfigEntry {
  layout?: 'default' | 'settings';
}

export type PluginDashboardConfig = {
  vite?: {
    plugins?: VitePlugin[];
  };
  routes?: MaybeAsyncFactory<
    CustomDashboardRoute[],
    [config: ResolvedCmsConfig]
  >;
};

declare module '@game-cms/core' {
  interface PluginConfig {
    dashboard?: PluginDashboardConfig;
  }
}
