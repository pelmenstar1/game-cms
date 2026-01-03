import { StorageFileItemWithId } from '@game-cms/base-types';
import { ComponentEntry } from '@game-cms/types';
import { ObjectId } from 'mongodb';

export type FileClientDataItem = Omit<StorageFileItemWithId, 'parent'>;

declare module '@game-cms/types' {
  interface ComponentTypeMap {
    'base::file': ComponentEntry<{
      rawData: string[];
      options: {
        supportedMimeTypes?: string[];
        minItems?: number;
        maxItems?: number;
      };
      error: string;
      clientData: FileClientDataItem[];
      storageData: ObjectId[];
    }>;
  }
}
