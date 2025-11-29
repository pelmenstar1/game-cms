import type { MaybeAsyncFactory, MaybePromise } from '@game-cms/shared';
import type { ObjectResolver } from '@game-cms/shared/object';
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
} from 'fastify';

import type { ApiRoute } from './api.js';
import type { ComponentController } from './component.js';
import type { ResolvedCmsConfig } from './config.js';
import type { Service } from './service.js';

export interface ValueSourceContext {
  config: ResolvedCmsConfig;

  compiledFilePath: (name: string) => string;
}

export type PluginValueSourceArgs = [context: ValueSourceContext];
export type PluginValueSource<T> = MaybeAsyncFactory<T, PluginValueSourceArgs>;

export type ApiRouteSource = PluginValueSource<ApiRoute[]>;
export type ComponentSource = PluginValueSource<ComponentController[]>;
export type ServiceSource = PluginValueSource<Service[]>;

export type EnvResolver<Env> = ObjectResolver<Env, PluginValueSourceArgs>;

type MaybeWithUrlPrefix<T> =
  | T
  | {
      urlPrefix: string;
      source: T;
    };

export type PluginApiFastifyConfig = {
  plugins?: (FastifyPluginCallback | FastifyPluginAsync)[];
  setup?: (instance: FastifyInstance) => MaybePromise<void>;
};

export type PluginApiConfig = {
  fastify?: PluginApiFastifyConfig;
  routes?: MaybeWithUrlPrefix<ApiRouteSource>;
};

type BasePlugin = {
  api?: PluginApiConfig;

  services?: ServiceSource;
  components?: ComponentSource;

  setup?: (config: ResolvedCmsConfig) => MaybePromise<void>;
};

export type Plugin<OwnEnv extends object | null = null> = OwnEnv extends null
  ? BasePlugin
  : BasePlugin & {
      env: EnvResolver<OwnEnv>;
    };
