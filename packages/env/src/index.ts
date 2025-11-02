import type {
  ComponentStaticConfigMap,
  DatabaseConfig,
  ServerConfig,
  ServerEntitySchema,
  SharedAssetsConfig,
  StorageConfig,
} from '@game-cms/types';

export type CmsEnvironment = {
  config: {
    storage: StorageConfig;
    database: DatabaseConfig;
    server: ServerConfig;
  };
  components: ComponentStaticConfigMap;
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
