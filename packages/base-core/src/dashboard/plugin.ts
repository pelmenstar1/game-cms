import { Plugin as VitePlugin } from 'vite';

export interface PluginDashboardConfig {
  vite?: {
    plugins?: VitePlugin[];
  };
}

declare module '@game-cms/core' {
  interface PluginConfig {
    dashboard?: PluginDashboardConfig;
  }
}
