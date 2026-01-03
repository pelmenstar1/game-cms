import type {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentRawDataById,
} from '@game-cms/core';

type FileError = ComponentErrorById<'base::file'>;
type FileData = ComponentRawDataById<'base::file'>;
type FileClientData = ComponentClientDataById<'base::file'>;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'game::spine': ComponentEntry<{
      rawData: {
        skeleton: FileData;
        atlas: FileData;
        images: FileData;
      };
      options: Record<never, never>;
      error: {
        skeleton: FileError | undefined;
        atlas: FileError | undefined;
        images: FileError | undefined;
      };
      clientData: {
        skeleton: FileClientData;
        atlas: FileClientData;
        images: FileClientData;
      };
    }>;
  }
}
