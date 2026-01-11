import { ComponentEntry } from '@game-cms/core';

declare module '@game-cms/core' {
  interface ComponentTypeMap {
    'base::json': ComponentEntry<{
      rawData: unknown;
      options: {
        allowEmpty?: boolean;
      };
      error: 'INVALID_FORMAT';
      clientData: string;
    }>;
  }
}
