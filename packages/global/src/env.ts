import type {
  ApiRoute,
  ComponentStaticConfigMap,
  ResolvedCmsConfig,
  Service,
  SharedAssetsConfig,
} from '@game-cms/types';

export interface ApiEnvironment {
  routes: ApiRoute[];
}

export type BaseCmsEnvironment = {
  config: ResolvedCmsConfig;
  components: ComponentStaticConfigMap;
  api: ApiEnvironment;
  services: Service[];
  sharedAssets: SharedAssetsConfig;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CmsEnvironment extends BaseCmsEnvironment {}

let _env: CmsEnvironment | undefined;

export function initializeEnv(value: CmsEnvironment) {
  _env = value;
}

export function env(): CmsEnvironment {
  if (_env === undefined) {
    throw new Error('Environment is not initialized');
  }

  return _env;
}
