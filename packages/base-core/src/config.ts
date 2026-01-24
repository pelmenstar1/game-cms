import type { RelativeTime } from '@game-cms/shared/chrono';
import type { MongoClientOptions } from 'mongodb';

import type { StorageProvider } from './storageProvider.js';

export type DatabaseConfig = {
  mongo: { url: string } & MongoClientOptions;
};

export type StorageConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: StorageProvider<any>;
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

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    auth: AuthConfig;
    storage: StorageConfig;
    database: DatabaseConfig;
  }
}
