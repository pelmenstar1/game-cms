import { ComponentEntry } from '@game-cms/core';

export const id = 'game::tile-grid' as const;
export type Id = typeof id;

declare module '@game-cms/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentTypeMap<_Args> {
    [id]: ComponentEntry<{
      outData: number[];
      error: 'INVALID_TYPE';
      options: {
        width: number;
        height: number;
      };
    }>;
  }
}
