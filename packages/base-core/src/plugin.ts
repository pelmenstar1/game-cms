import { ResolvedCmsConfig } from '@game-cms/core';
import {
  FilePortal,
  MaybeAsyncFactory,
  PartialIfUndefined,
} from '@game-cms/shared';
import { MaybeArray } from '@game-cms/shared/collections';

export interface OwnPluginClientConfig {}

export interface PluginClientConfig extends OwnPluginClientConfig {}

export interface PluginClientConfigResolver<OwnConfig> {
  mergeConfigs: (base: OwnConfig, next: OwnConfig) => OwnConfig;
}

export type PluginClientConfigSource = MaybeAsyncFactory<
  MaybeArray<FilePortal>,
  [config: ResolvedCmsConfig]
>;

declare module '@game-cms/core' {
  interface PluginConfig {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginMixins<Types extends PluginTypes> {
    clientConfigSource?: PluginClientConfigSource;
  }
}
