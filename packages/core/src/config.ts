import type { MaybePromise, RequiredProperty } from '@game-cms/shared';
import type { EnvAccessor } from '@game-cms/shared/node';

import type { AnyPlugin } from './plugin.js';

export interface UnresolvedCmsConfig {
  plugins?: AnyPlugin[];
}

export type ResolvedCmsConfig = RequiredProperty<
  UnresolvedCmsConfig,
  'plugins'
>;

type MaybeEnv<R extends object> = R | ((env: EnvAccessor) => MaybePromise<R>);

export type ConfigInit = MaybeEnv<UnresolvedCmsConfig>;

export function config(value: ConfigInit): ConfigInit {
  return value;
}
