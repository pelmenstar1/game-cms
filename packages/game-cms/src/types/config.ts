import type { EnvAccessor, MaybePromise } from '@game-cms/shared';
import type {
  AuthConfig,
  DatabaseConfig,
  ServerConfig,
  StorageConfig,
} from '@game-cms/types';

export type ConfigInit<R extends object> =
  | R
  | ((env: EnvAccessor) => MaybePromise<R>);

export type DatabaseInit = ConfigInit<DatabaseConfig>;
export type StorageInit = ConfigInit<StorageConfig>;
export type ServerInit = ConfigInit<ServerConfig>;
export type AuthInit = ConfigInit<AuthConfig>;
