import type { ObjectId } from 'mongodb';

export type StorageFolderItem = {
  type: 'folder' | 'file';
  id: ObjectId;
};

export type StorageFolder = {
  name: string;
  children: StorageFolderItem[];
};
