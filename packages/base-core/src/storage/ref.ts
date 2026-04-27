import { ObjectId } from 'mongodb';

import { StorageItemType } from './core.js';

declare module '@game-cms/core' {
  interface ReferenceableTypeRegistry {
    'base::storageItem': {
      handle: { id: ObjectId; type: StorageItemType };
    };
  }
}
