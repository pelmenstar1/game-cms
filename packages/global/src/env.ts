import type {
  ComponentControllerMap,
  ResolvedCmsConfig,
  Service,
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
  services: Service[];
};

export interface CmsEnvironment extends BaseCmsEnvironment {}

let _env: CmsEnvironment | undefined;

export function setEnvironment(value: CmsEnvironment) {
  _env = value;
}

export function env(): CmsEnvironment {
  if (_env === undefined) {
    throw new Error('Environment is not initialized');
  }

  return _env;
}

export function isEnvInitialized(): boolean {
  return _env !== undefined;
}
