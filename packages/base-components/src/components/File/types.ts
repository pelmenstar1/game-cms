import { StorageFileItemWithId } from '@game-cms/base-types';
import { ComponentEntry } from '@game-cms/types';

export type FileClientDataItem = Omit<StorageFileItemWithId, 'parent'>;

declare module '@game-cms/types' {
  interface ComponentTypeMap {
    'base::file': ComponentEntry<{
      data: {
        items: string[];
      };
      options: {
        supportedMimeTypes: string[];
        minItems?: number;
        maxItems?: number;
      };
      error: string;
      clientData: {
        items: FileClientDataItem[];
      };
    }>;
  }
}
