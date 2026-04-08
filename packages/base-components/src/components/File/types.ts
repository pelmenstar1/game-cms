import { StorageFileItemWithId } from '@game-cms/base-core';
import { ComponentEntry, ToClientType } from '@game-cms/core';
import { ObjectId } from 'mongodb';

export const id = 'base::file';
export type Id = typeof id;

export type FileOutDataItem = StorageFileItemWithId;
export type FileClientDataItem = ToClientType<FileOutDataItem>;

declare module '@game-cms/core' {
  interface ComponentTypeMap {
    [id]: ComponentEntry<{
      outData: FileOutDataItem[];
      inData: string[];
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
