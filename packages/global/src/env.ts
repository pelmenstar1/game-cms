import type {
  ComponentControllerMap,
  ResolvedCmsConfig,
  ServiceMap,
} from '@game-cms/core';
import type { ApiRoute } from '@game-cms/core/api';

export interface ApiEnvironment {
  routes: ApiRoute[];
}

export type ComponentDistributionInfo = {
  pluginId: string;
  directoryPath: string;
};

export type ComponentEnv = {
  distributions: ComponentDistributionInfo[];
  controllers: ComponentControllerMap;
};

export type BaseCmsEnvironment = {
  config: ResolvedCmsConfig;
  components: ComponentEnv;
  api: ApiEnvironment;
  services: ServiceMap;
};

export interface CmsEnvironment extends BaseCmsEnvironment {}

const store = globalThis as unknown as Record<string, unknown>;
const KEY = '__game_cms_env__';

export function setEnvironment(value: CmsEnvironment) {
  store[KEY] = value;
}

export function env(): CmsEnvironment {
  const value = store[KEY] as CmsEnvironment | undefined;
  if (value === undefined) {
    throw new Error('Environment is not initialized');
  }

  return value;
}

export function isEnvInitialized(): boolean {
  return store[KEY] !== undefined;
}
