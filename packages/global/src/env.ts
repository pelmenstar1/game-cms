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

declare global {
  var __game_cms_env__: CmsEnvironment | undefined;
}

const KEY = '__game_cms_env__';

export function setEnvironment(value: CmsEnvironment) {
  globalThis[KEY] = value;
}

export function env(): CmsEnvironment {
  const value = globalThis[KEY];
  if (value === undefined) {
    throw new Error('Environment is not initialized');
  }

  return value;
}

export function isEnvInitialized(): boolean {
  return globalThis[KEY] !== undefined;
}
