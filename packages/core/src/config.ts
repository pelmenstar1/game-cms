import type { MaybePromise, RequiredProperty } from '@game-cms/shared';
import type { EnvAccessor } from '@game-cms/shared/node';

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

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;

export function config(value: ConfigInit): ConfigInit {
  return value;
}
