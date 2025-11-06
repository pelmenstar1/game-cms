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

export type AuthConfig = {
  jwtSignKey: CryptoKey;
  admin: {
    email: string;
    password: string;
  };
  expirationTimes?: {
    user?: string | number;
    apiToken: string | number;
  };
  apiToken?: {
    byteLength?: number;
  };
};
