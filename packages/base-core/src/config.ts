import type { RelativeTime } from '@game-cms/shared/chrono';
import type { MongoClientOptions } from 'mongodb';

import type { AnyEntityCheck } from './entityCheck.js';
import type { AnyStorageAddon } from './storage.js';
import type { AnyStorageProvider } from './storageProvider.js';

export type DatabaseConfig = {
  mongo: { url: string } & MongoClientOptions;
};

export type StorageConfig = {
  provider: AnyStorageProvider;
  addons?: AnyStorageAddon[];
};

export type ExpirationTimeType = 'userSession' | 'userRefresh' | 'apiToken';

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

export type EntityConfig = {
  checks?: AnyEntityCheck[];
};

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    auth: AuthConfig;
    storage: StorageConfig;
    database: DatabaseConfig;
    entity?: EntityConfig;
  }
}
