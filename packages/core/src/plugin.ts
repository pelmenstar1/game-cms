import type {
  MaybeAsyncFactory,
  MaybePromise,
  UnionToIntersection,
} from '@game-cms/shared';
import type { ObjectResolver } from '@game-cms/shared/object';
import type { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';

import { ApiErrorStatusMap } from './api/error.js';
import type { CmsFastifyInstance } from './api/fastify.js';
import type { ApiRoute } from './api/route.js';
import type { ResolvedCmsConfig } from './config.js';
import type { Service } from './service.js';

export interface PluginValueSourceContext {
  config: ResolvedCmsConfig;

  compiledFilePath: (name: string) => string;
}

export type PluginValueSourceArgs = [context: PluginValueSourceContext];
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
  setup?: (instance: CmsFastifyInstance) => MaybePromise<void>;
};

export interface PluginApiConfig {
  fastify?: PluginApiFastifyConfig;
  routes?: MaybeWithUrlPrefix<ApiRouteSource>;
  error?: {
    statuses?: ApiErrorStatusMap;
  };
}

export interface PluginConfig {
  api?: PluginApiConfig;
}

type PluginCore = {
  id: string;

  config?: PluginConfig;
  services?: ServiceSource;
  components?: ComponentSource;

  setup?: (config: ResolvedCmsConfig) => MaybePromise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PluginMixins<Types extends PluginTypes> {}

export interface PluginTypeManager<Types extends PluginTypes> {
  env: {
    env: EnvResolver<Types['env']>;
  };
}

export interface PluginTypes {
  env?: unknown;
}

type UndefinedPluginTypes = Record<keyof PluginTypes, undefined>;

type HandlePartial<T, U> = U extends undefined
  ? Partial<T>
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any extends U
    ? Partial<T>
    : T;

type HandlePluginCustomType<
  K extends keyof PluginTypes,
  Types extends PluginTypes,
> =
  PluginTypeManager<Types> extends Record<K, unknown>
    ? HandlePartial<PluginTypeManager<Types>[K], Types[K]>
    : never;

type PluginAddonsContent<Types extends PluginTypes> = Required<{
  [K in keyof PluginTypes]: HandlePluginCustomType<K, Types>;
}>[keyof PluginTypes];

type PluginAddons<Types extends PluginTypes> = UnionToIntersection<
  PluginAddonsContent<Types>
>;

export type Plugin<Types extends PluginTypes = UndefinedPluginTypes> =
  PluginCore & PluginAddons<Types> & PluginMixins<Types>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyPlugin = Plugin<any>;
