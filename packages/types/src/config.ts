import type { RelativeTime } from '@game-cms/shared/chrono';
import type { MongoClientOptions } from 'mongodb';

import type { StorageProvider } from './storageProvider.js';

export type DatabaseConfig = {
  mongo: { url: string } & MongoClientOptions;
};

export type StorageConfig = {
  provider: StorageProvider;
};

export type ServerConfig = {
  port: number;
};

export type ExpirationTimeType = 'user' | 'apiToken';

export type AuthConfig = {
  jwtSignKey: string | Uint8Array | CryptoKey;
  admin: {
    email: string;
    password: string;
  };
  expirationTimes?: Partial<Record<ExpirationTimeType, RelativeTime | number>>;
  apiToken?: {
    byteLength?: number;
  };
};

export type CmsConfig = {
  storage: StorageConfig;
  database: DatabaseConfig;
  server: ServerConfig;
  auth: AuthConfig;
};
