import { ComponentEntry } from '@game-cms/core';

export const id = 'base::number' as const;
export type Id = typeof id;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<{
      outData: number;
      clientData: string;
      options: {
        integer?: boolean;
        min?: number;
        max?: number;
      };
      error:
        'INVALID_TYPE' | 'TOO_SMALL' | 'TOO_LARGE' | 'NAN' | 'EXPECTED_INTEGER';
    }>;
  }
}
