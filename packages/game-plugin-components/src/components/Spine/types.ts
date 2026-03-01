import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentInDataById,
  ComponentOutDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

type FileError = ComponentErrorById<'base::file'>;
type FileData = ComponentOutDataById<'base::file'>;
type FileDataIn = ComponentInDataById<'base::file'>;
type FileStorageData = ComponentStorageDataById<'base::file'>;
type FileClientData = ComponentClientDataById<'base::file'>;

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
