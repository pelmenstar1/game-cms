import { StorageFileItemWithMeta } from '@game-cms/base-core';
import { ComponentEntry, ToClientType } from '@game-cms/core';
import { ObjectId } from 'mongodb';

export type FileRawDataItem = StorageFileItemWithMeta;
export type FileClientDataItem = ToClientType<StorageFileItemWithMeta>;

declare module '@game-cms/core' {
  interface ComponentTypeMap {
    'base::file': ComponentEntry<{
      rawData: FileRawDataItem[];
      rawInData: string[];
      options: {
        supportedMimeTypes?: string[];
        minItems?: number;
        maxItems?: number;
      };
      error: 'INVALID_TYPE' | 'TOO_FEW_ITEMS' | 'TOO_MANY_ITEMS';
      clientData: FileClientDataItem[];
      storageData: ObjectId[];
    }>;
  }
}
