import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

type FileId = 'base::file';

export const id = 'game::spine' as const;
export type Id = typeof id;

type FileError = ComponentErrorById<FileId>;
type FileData = ComponentOutDataById<FileId>;
type FileDataIn = ComponentInDataById<FileId>;
type FileStorageData = ComponentStorageDataById<FileId>;
type FileClientData = ComponentClientDataById<FileId>;

type BaseData<T> = {
  skeleton: T;
  atlas: T;
  images: T;
};

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'game::spine': ComponentEntry<{
      options: Record<never, never>;
      error: {
        ownError?: 'INVALID_TYPE';
        skeleton?: FileError;
        atlas?: FileError;
        images?: FileError;
      };
      outData: BaseData<FileData> & {
        originalAtlas?: FileData[number];
      };
      inData: BaseData<FileDataIn>;
      partialInData: Partial<BaseData<FileDataIn>>;
      clientData: BaseData<FileClientData>;
      storageData: BaseData<FileStorageData> & {
        shadowAtlas?: FileStorageData[number];
      };
    }>;
  }
}
