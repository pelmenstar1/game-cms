import { ComponentEntry } from '@game-cms/core';

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    'base::number': ComponentEntry<{
      outData: number;
      clientData: string;
      options: {
        integer?: boolean;
        min?: number;
        max?: number;
      };
      error:
        | 'INVALID_TYPE'
        | 'TOO_SMALL'
        | 'TOO_LARGE'
        | 'NAN'
        | 'EXPECTED_INTEGER';
    }>;
  }
}
