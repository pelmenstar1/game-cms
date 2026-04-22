import { ComponentEntry } from '@game-cms/core';

export const id = 'base::date' as const;
export type Id = typeof id;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<{
      outData: string;
      error: 'INVALID_TYPE' | 'TOO_EARLY' | 'TOO_LATE';
      options: {
        minDate?: Date;
        maxDate?: Date;
      };
      clientData: Date;
      storageData: Date;
      searchIndexData: string[];
    }>;
  }
}
