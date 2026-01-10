import { ComponentEntry } from '@game-cms/core';

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::date': ComponentEntry<{
      rawData: string;
      error: 'INVALID_TYPE' | 'TOO_EARLY' | 'TOO_LATE';
      options: {
        minDate?: string | Date;
        maxDate?: string | Date;
      };
      clientData: Date;
      storageData: Date;
    }>;
  }
}
