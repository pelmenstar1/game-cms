import type {
  DatabaseConfig,
  ServerConfig,
  StorageConfig,
} from '@game-cms/types';
import type { EnvAccessor } from '../utils/env.js';

type MaybePromise<T> = T | Promise<T>;
export type ConfigInit<R extends object> =
  | R
  | ((env: EnvAccessor) => MaybePromise<R>);

export type DatabaseInit = ConfigInit<DatabaseConfig>;
export type StorageInit = ConfigInit<StorageConfig>;
export type ServerInit = ConfigInit<ServerConfig>;
