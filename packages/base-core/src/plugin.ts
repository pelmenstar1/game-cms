import { FilePortal, PartialIfUndefined } from '@game-cms/shared';
import type { Plugin as VitePlugin } from 'vite';

export type PluginDashboardConfig = {
  vite?: {
    plugins?: VitePlugin[];
  };
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OwnPluginClientConfig {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PluginClientConfig extends OwnPluginClientConfig {}

export interface PluginClientConfigResolver<OwnConfig> {
  mergeConfigs: (base: OwnConfig, next: OwnConfig) => OwnConfig;
}

declare module '@game-cms/core' {
  interface PluginConfig {
    dashboard?: PluginDashboardConfig;
    client?: FilePortal;
  }

  interface PluginTypes {
    clientConfig?: unknown;
  }

  interface PluginTypeManager<Types extends PluginTypes> {
    clientConfig: PartialIfUndefined<
      {
        clientConfigResolver: FilePortal;
      },
      Types['clientConfig']
    >;
  }
}
