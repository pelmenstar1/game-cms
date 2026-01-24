import type { MaybeAsyncFactory, MaybePromise } from '@game-cms/shared';
import type { ObjectResolver } from '@game-cms/shared/object';
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
} from 'fastify';
import type { Plugin as VitePlugin } from 'vite';

import type { ApiRoute } from './api/route.js';
import type { ResolvedCmsConfig } from './config.js';
import type { Service } from './service.js';

export interface ValueSourceContext {
  config: ResolvedCmsConfig;

  compiledFilePath: (name: string) => string;
}

export type PluginValueSourceArgs = [context: ValueSourceContext];
export type PluginValueSource<T> = MaybeAsyncFactory<T, PluginValueSourceArgs>;

export type ApiRouteSource = PluginValueSource<ApiRoute[]>;
export type ComponentSource = PluginValueSource<{ distributionPath: string }>;
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

export interface PluginApiConfig {
  fastify?: PluginApiFastifyConfig;
  routes?: MaybeWithUrlPrefix<ApiRouteSource>;
}

export type PluginDashboardConfig = {
  plugins?: VitePlugin[];
};

type BasePlugin = {
  id: string;
  api?: PluginApiConfig;

  services?: ServiceSource;
  components?: ComponentSource;
  dashboard?: PluginDashboardConfig;

  setup?: (config: ResolvedCmsConfig) => MaybePromise<void>;
  onConfigChanged?: () => MaybePromise<void>;
};

export type Plugin<OwnEnv extends object | null = null> = OwnEnv extends null
  ? BasePlugin
  : BasePlugin & {
      env: EnvResolver<OwnEnv>;
    };
