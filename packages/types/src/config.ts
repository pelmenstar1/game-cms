import type { StorageProvider } from './storageProvider.js';
import type { MongoClientOptions } from 'mongodb';

export type DatabaseConfig = {
  mongo: { url: string } & MongoClientOptions;
};

export type StorageConfig = {
  provider: StorageProvider;
};

export type ServerConfig = {
  port: number;
};
