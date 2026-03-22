import { MongoClientOptions } from 'mongodb';

export interface DatabaseCollectionTypeMap {}

export type DatabaseCollectionId = keyof DatabaseCollectionTypeMap;

export type DatabaseConfig = {
  mongo: { url: string } & MongoClientOptions;
};

declare module '@game-cms/core' {
  interface UnresolvedCmsConfig {
    database: DatabaseConfig;
  }
}
