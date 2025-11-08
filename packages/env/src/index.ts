import type {
  ApiRoute,
  AuthConfig,
  ComponentStaticConfigMap,
  DatabaseConfig,
  ServerConfig,
  ServerEntitySchema,
  Service,
  SharedAssetsConfig,
  StorageConfig,
} from '@game-cms/types';

export type CmsEnvironment = {
  config: {
    storage: StorageConfig;
    database: DatabaseConfig;
    server: ServerConfig;
    auth: AuthConfig;
  };
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
