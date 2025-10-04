import type { StorageProvider } from './storageProvider.js';

export type DatabaseConfig = {
  mongo: {
    connectionString: string;
  };
};

export type StorageConfig = {
  provider: StorageProvider;
};

export type ServerConfig = {
  port: number;
};
