import type { RequiredProperty } from '@game-cms/shared';

import type { Plugin } from './plugin.js';

export type ServerConfig = {
  port: number;
};

export interface UnresolvedCmsConfig {
  plugins?: Plugin<object | null>[];
  server: ServerConfig;
}

export type ResolvedCmsConfig = RequiredProperty<
  UnresolvedCmsConfig,
  'plugins'
>;
