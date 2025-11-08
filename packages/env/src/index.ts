import type {
  ApiRoute,
  CmsConfig,
  ComponentStaticConfigMap,
  ServerEntitySchema,
  Service,
  SharedAssetsConfig,
} from '@game-cms/types';

export type CmsEnvironment = {
  config: CmsConfig;
  components: ComponentStaticConfigMap;
  apiRoutes: ApiRoute[];
  services: Service[];
  entitySchemas: ServerEntitySchema[];
  sharedAssets: SharedAssetsConfig;
};

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
