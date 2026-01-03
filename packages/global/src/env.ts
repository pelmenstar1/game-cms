import type {
  ApiRoute,
  ComponentControllerMap,
  ResolvedCmsConfig,
  Service,
} from '@game-cms/types';

export interface ApiEnvironment {
  routes: ApiRoute[];
}

export type ComponentEnv = {
  distributions: string[];
  controllers: ComponentControllerMap;
};

export type BaseCmsEnvironment = {
  config: ResolvedCmsConfig;
  components: ComponentEnv;
  api: ApiEnvironment;
  services: Service[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
