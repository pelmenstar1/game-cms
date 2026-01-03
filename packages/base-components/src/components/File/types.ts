import { StorageFileItemWithId } from '@game-cms/base-types';
import { ComponentEntry } from '@game-cms/core';
import { ObjectId } from 'mongodb';

export type FileClientDataItem = Omit<StorageFileItemWithId, 'parent'>;

declare module '@game-cms/core' {
  interface ComponentTypeMap {
    'base::file': ComponentEntry<{
      rawData: string[];
      options: {
        supportedMimeTypes?: string[];
        minItems?: number;
        maxItems?: number;
      };
      error: 'TOO_FEW_ITEMS' | 'TOO_MANY_ITEMS';
      clientData: FileClientDataItem[];
      storageData: ObjectId[];
    }>;
  }
}
