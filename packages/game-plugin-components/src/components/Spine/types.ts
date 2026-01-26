import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentStorageDataById,
} from '@game-cms/core';

type FileError = ComponentErrorById<'base::file'>;
type FileData = ComponentRawDataById<'base::file'>;
type FileDataIn = ComponentRawInDataById<'base::file'>;
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
      rawData: BaseData<FileData>;
      rawInData: BaseData<FileDataIn>;
      partialRawInData: Partial<BaseData<FileDataIn>>;
      clientData: BaseData<FileClientData>;
      storageData: BaseData<FileStorageData>;
    }>;
  }
}
